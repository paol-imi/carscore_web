import boto3
import os
import pickle
import pymysql
import requests
import random
import warnings
from sqlalchemy import create_engine, text as sql_text
from datetime import datetime, timedelta, date
import numpy.fft as fft
import pandas as pd
import numpy as np
import time


def lambda_handler(event, context):
    try:
        # Load the model.
        model_log = load_pickle_model_from_s3("LogReg_full")
        model_scaler = load_pickle_model_from_s3("scaler_full")
        model_xgboost = load_pickle_model_from_s3("XGBOOST_full")

        # Connect to the database.
        connection, cursor = connect_to_db()

        # NOTE: We simply fetch one address at a time from the database.
        #       This is not the most efficient way to do this, but should be
        #       good enough (assuming that the bottleneck is anyway represented
        #       by the blockchain API). In future we can improve this by fetching
        #       multiple addresses at a time, but this will require managing
        #       concurrent inserts into the bitcoin table.
        #
        # While there are addresses to process.
        while address := fetch_one_address_from_db(cursor):
            # Fetch the transactions for the address.
            transactions, error = fetch_transactions_from_blockchain_api(
                address)
            if error == -1:
                print("ERROR: TOO MANY REQUESTS TO BLOCKCHAIN.COM")
                time.sleep(11)
                exit() 
            elif error == -2:
                print("Address not found")
                commit_rating_to_db(cursor, address, -1)
                time.sleep(11)
                continue 
            elif error == -3:
                print("Error retrieving the information from blockchain.com")
                commit_rating_to_db(cursor, address, -1)
                time.sleep(11)
                continue

            # Compute the rating for the transactions.
            rating = compute_rating(
                address, transactions, model_xgboost, model_log, model_scaler)
            # Commit the rating to the database.
            commit_rating_to_db(cursor, address, rating)
            time.sleep(11)

    except Exception as e:
        print("Process failed due to {}".format(e))
    finally:
        print("Process completed")
        # Close the cursor and the connection
        connection.close()


def fetch_transactions_from_blockchain_api(address):
    # --------------------------------PARAMETERS-----------------------------------------------------------
    tx_num_limit = 500  # Max number of txs to download in the selected time period
    TOO_MANY_REQ = -1
    NOT_VALID_ADDR = -2
    # -----------------------------------------------------------------------------------------------------

    # Get the data from the blockchain.info API
    r = requests.get(
        f"https://blockchain.info/rawaddr/{address}?limit={tx_num_limit}")
    if r.status_code == 404:
        return r.json, NOT_VALID_ADDR
    elif r.status_code == 429:
        return r.json, TOO_MANY_REQ
    # Return array of transactions
    try:
        json = r.json()
    except requests.exceptions.JSONDecodeError:
        return None, -3
    return json, 0


def load_pickle_model_from_s3(model_name):
    # Read the model from S3
    s3 = boto3.client('s3')
    bucket_name = os.environ['BUCKET_NAME']
    key = f'{model_name}.joblib'
    local_file_path = f'/tmp/{model_name}.joblib'
    # Download the file from S3 to the /tmp directory
    s3.download_file(bucket_name, key, local_file_path)
    # Load the model from the local file
    file = open(local_file_path, 'rb')
    return pickle.load(file)


def connect_to_db():
    # Connect to the database
    connection = pymysql.connect(host=os.environ['DB_HOST'],
                                 user=os.environ['DB_USER'],
                                 passwd=os.environ['DB_PASSWORD'],
                                 port=3306,
                                 database=os.environ['DB_NAME'],
                                 autocommit=False)

    cursor = connection.cursor()

    return connection, cursor


def fetch_one_address_from_db(cursor):
    cursor.execute("SELECT missing_address FROM `missing_address`")
    result = cursor.fetchone()
    return result[0] if result is not None else None


def commit_rating_to_db(cursor, address, rating):
    cursor.execute("BEGIN")
    cursor.execute("INSERT INTO `bitcoin` (address, note) VALUES (%s, %s) ON DUPLICATE KEY UPDATE note = %s",
                   (address, rating, rating))
    cursor.execute("DELETE FROM `missing_address` WHERE missing_address = %s",
                   (address,))
    cursor.execute("COMMIT")


def delete_one_address_from_db(cursor, address):
    cursor.execute("BEGIN")
    cursor.execute("DELETE FROM `missing_address` WHERE missing_address = %s",
                   (address,))
    cursor.execute("COMMIT")


def download_btc_price(start_time_window, api_key):
    now = date.today()
    start_date = start_time_window.date()
    distance = (now - start_date).days + 1

    if distance > 2000:
        return None

    response = requests.get(
        f"https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit={distance}&api_key={api_key}")
    address_json = response.json()
    data = address_json['Data']
    data = data['Data']
    btc_usd = pd.DataFrame.from_records(data)
    btc_usd = btc_usd.drop(
        columns=['open', 'high', 'low', 'volumefrom', 'volumeto', 'conversionType', 'conversionSymbol'], axis=1)
    btc_usd['time'] = pd.to_datetime(btc_usd['time'], unit='s')
    btc_usd.set_index("time", inplace=True)

    return btc_usd


def txs_stats(df, time_window_length):
    """
    txs_stats computes statistics on wallet number of txs
    :param time_window_length: (int) length of the time window to use
    :param df: dataframe on a single wallet_id
    :param: (int) the length of the time window
    :return: statistics on number of txs and avg based on days/weeks/months of activity
    """

    query_txs = '''SELECT wallet_id,
        COUNT(*) as txs,
        SUM(CASE WHEN amount > 0 THEN 1 ELSE 0 END) AS txs_in,
        SUM(CASE WHEN amount < 0 THEN 1 ELSE 0 END) AS txs_out
        FROM data
        GROUP BY wallet_id
        ORDER BY wallet_id;'''

    engine = create_engine('sqlite:///tmp/mydatabase.db')
    df.to_sql('data', con=engine, if_exists='replace')
    txs_stats = pd.read_sql_query(
        con=engine.connect(), sql=sql_text(query_txs))

    max_time = df['time'].max()
    min_time = df['time'].min()
    time_diff = max_time - min_time

    relative_days = time_diff.days + 1
    relative_weeks = relative_days // 7 + 1
    relative_months = relative_days // 28 + 1

    txs = txs_stats['txs']
    txs_in = txs_stats['txs_in']
    txs_out = txs_stats['txs_out']

    # AVG_DAYS_WEEKS_MONTHS
    relative_avg_days = txs_stats['txs'] / relative_days
    relative_avg_weeks = txs_stats['txs'] / relative_weeks
    relative_avg_months = txs_stats['txs'] / relative_months

    days = time_window_length
    weeks = days // 7 + 1
    months = days // 28 + 1

    avg_days = txs_stats['txs'] / days
    avg_weeks = txs_stats['txs'] / weeks
    avg_months = txs_stats['txs'] / months

    return txs, txs_in, txs_out, relative_avg_days, relative_avg_weeks, relative_avg_months, avg_days, avg_weeks, \
        avg_months


def amount_stats_positive(df):
    """
    amount_stats computes the stats based on the amount/amount_usd of the dataframe passed
    :param df: dataframe on a single wallet_id
    :return: amounts stats avg/max/min on amount/amount_usd
    """

    query_amounts = '''SELECT wallet_id,
            MAX(amount) AS max_amount,
            MIN(amount) AS min_amount,
            AVG(amount) AS avg_amount,
            MAX(amount_usd) AS max_amount_usd,
            MIN(amount_usd) AS min_amount_usd,
            AVG(amount_usd) AS avg_amount_usd
        FROM data
        WHERE amount_usd > 0
        GROUP BY wallet_id
        ORDER BY wallet_id;
        '''

    engine = create_engine('sqlite:///tmp/mydatabase.db')
    df.to_sql('data', con=engine, if_exists='replace')
    amounts_stats = pd.read_sql_query(
        con=engine.connect(), sql=sql_text(query_amounts))

    # returns avg_amount, max_amount, min_amount, avg_amount_usd, max_amount_usd, min_amount_usd
    return amounts_stats['avg_amount'], amounts_stats['max_amount'], amounts_stats['min_amount'], amounts_stats[
        'avg_amount_usd'], amounts_stats['max_amount_usd'], amounts_stats['min_amount_usd']


def amount_stats_negative(df):
    """
    amount_stats computes the stats based on the amount/amount_usd of the dataframe passed
    :param df: dataframe on a single wallet_id
    :return: amounts stats avg/max/min on amount/amount_usd
    """

    query_amounts = '''SELECT wallet_id,
            MAX(amount) AS max_amount,
            MIN(amount) AS min_amount,
            AVG(amount) AS avg_amount,
            MAX(amount_usd) AS max_amount_usd,
            MIN(amount_usd) AS min_amount_usd,
            AVG(amount_usd) AS avg_amount_usd
        FROM data
        WHERE amount_usd <= 0
        GROUP BY wallet_id
        ORDER BY wallet_id;
        '''

    engine = create_engine('sqlite:///tmp/mydatabase.db')
    df.to_sql('data', con=engine, if_exists='replace')
    amounts_stats = pd.read_sql_query(
        con=engine.connect(), sql=sql_text(query_amounts))

    # returns avg_amount, max_amount, min_amount, avg_amount_usd, max_amount_usd, min_amount_usd
    return amounts_stats['avg_amount'], amounts_stats['max_amount'], amounts_stats['min_amount'], amounts_stats[
        'avg_amount_usd'], amounts_stats['max_amount_usd'], amounts_stats['min_amount_usd']


def distance_stats(df):
    """
    distance_stats computes statistics based on the distance between consecutive couples of txs of the wallet
    :param df: dataframe on a single wallet_id
    :return: max, min and avg of txs distance
    """
    distance_df = pd.DataFrame(
        df, columns=["hash", "wallet_id", "amount", "amount_usd", "time", "label"])
    times = distance_df["time"].to_numpy()
    times.sort()

    distances = []
    for i in range(len(times) - 1):
        date_diff = times[i + 1] - times[i]
        seconds = float(date_diff / (10 ** 9))
        days = seconds / (60 * 60 * 24)
        distances.append(days)

    if len(distances) == 0:
        max_dist, min_dist, avg_dist = [0, 0, 0]
    else:
        max_dist = max(distances)
        min_dist = min(distances)
        avg_dist = sum(distances) / len(distances)

    return np.float64(max_dist), np.float64(min_dist), np.float64(avg_dist)


def activity_stats(df):
    """
    computes the activity and inactivity period of the wallet
    :param df: dataframe on a single wallet_id
    :return: activity and inactivity period of the wallet
    """
    max_time = df['time'].max()
    min_time = df['time'].min()

    # Inactivity period
    now = pd.Timestamp.now()
    inactivity_period = (now - max_time).days

    # Activity period
    activity_period = (max_time - min_time).days + 1
    return activity_period, inactivity_period


def time_conversion(amount, range='month'):
    """
    time_conversion is used to change time aggregation from days to weeks/months
    :param amount:  array of wallets txs amounts
    :param range: time aggregation (week/month)
    :return:  final_amount, final_amount_usd with a different time aggregation
    """
    correct_amount = np.asarray(amount)
    length = len(correct_amount)
    if range == 'week':
        padded_days = length + (7 - (length % 7))
        correct_amount.resize(padded_days, refcheck=False)
        final_amount = correct_amount.reshape(-1, 7).sum(axis=1)
    elif range == 'month':
        padded_days = length + (30 - length % 30)
        correct_amount.resize(padded_days, refcheck=False)
        final_amount = correct_amount.reshape(-1, 30).sum(axis=1)
    return final_amount


def fft_sort(a, c):
    """
    fft_sort is used to sort fft results and their freq respecting the order of indices
    :param a: array of fft computed on amount
    :param c: array of fft frequencies
    :return: sorted arrays with respect to c indices
    """
    sorted_indices = np.argsort(c)
    sorted_a = a[sorted_indices]
    sorted_c = c[sorted_indices]
    return sorted_a, sorted_c


def ffts(df, time_window_length):
    """
    fft_stats computes the fast fourier transform based on the wallet transactions in a daily/weekly/monthly time
    aggregation
    :param df: dataframe of useful transactions to process
    :param time_window_length: (int) length of the time window
    :return: sorted_days_ftt, sorted_days_ftt_usd, sorted_days_freq: fft on daily agg for amount and amount_usd +
                days_freq
            sorted_week_fft, sorted_week_fft_usd, sorted_week_freq: fft on weekly agg for amount and amount_usd +
                weeks_freq
            sorted_month_fft, sorted_month_fft_usd, sorted_month_freq: fft on monthly agg for amount and amount_usd +
                months_freq
    """
    days = time_window_length

    min_time = df['time'].min()
    min_time = min_time.date()

    time_list_days = [min_time + timedelta(days=idx) for idx in range(days)]

    query_balance = '''SELECT SUM(amount) as amount, DATE(time) AS time
                        FROM data
                        GROUP BY wallet_id, time
                        ORDER BY time ASC'''

    engine = create_engine('sqlite:///tmp/mydatabase.db')
    df.to_sql('data', con=engine, if_exists='replace')
    balance_stats = pd.read_sql_query(
        con=engine.connect(), sql=sql_text(query_balance))
    balance_stats["time"] = balance_stats["time"].astype("string")

    # Iterates for every day in that interval
    index = balance_stats.index
    amounts_sent = []

    for time in time_list_days:
        time = str(time)
        # Checks if in the date considered, the entity made a transaction
        if time in balance_stats["time"].values:
            # If yes, adds the bitcoin amount in the list of amounts sent
            row_index = balance_stats["time"] == time
            row_index = index[row_index]
            amount = float(sum(balance_stats.iloc[row_index]["amount"].values))
            amounts_sent.append(amount)
        else:
            # If not, adds 0 in the list of amounts sent
            amounts_sent.append(0)

    week_amount = time_conversion(amounts_sent, range='week')
    month_amount = time_conversion(amounts_sent, range='month')

    # Fast Fourier Transform
    days_fft = fft.fft(amounts_sent)
    weeks_fft = fft.fft(week_amount)
    month_fft = fft.fft(month_amount)

    days_freq = np.fft.fftfreq(np.asarray(amounts_sent).shape[-1])
    weeks_freq = np.fft.fftfreq(np.asarray(week_amount).shape[-1])
    month_freq = np.fft.fftfreq(np.asarray(month_amount).shape[-1])

    sorted_days_ftt, sorted_days_freq = fft_sort(days_fft, days_freq)
    sorted_week_fft, sorted_week_freq = fft_sort(weeks_fft, weeks_freq)
    sorted_month_fft, sorted_month_freq = fft_sort(month_fft, month_freq)

    return sorted_days_ftt, sorted_days_freq, sorted_week_fft, sorted_week_freq, sorted_month_fft, sorted_month_freq


def compute_range_ratio(max_value, min_value, avg):
    """
    Computes the range (difference between max and min) and the ratio between the range and the mean
    :param max_value: maximum value for the attribute
    :param min_value: minimum value of the attribute
    :param avg: average value of the attributes
    :return: range and ratio
    """
    warnings.filterwarnings("ignore")
    range_value = max_value - min_value
    try:
        ratio = range_value / avg
    except RuntimeWarning:
        ratio = 0

    return range_value, ratio


def bw(fft, th=0.5):
    """
    computes the bandwidth of the fft
    :param fft: fft of the status of the wallet
    :param th: threshold to consider the range of frequency as significant
    :return: the bandwidth of the fft
    """
    warnings.filterwarnings("ignore")
    # Compute the magnitude spectrum
    magnitude_spectrum = np.abs(fft)
    # Normalize the magnitude spectrum
    normalized_spectrum = magnitude_spectrum / np.max(magnitude_spectrum)
    # Define a threshold (e.g., 0.5) to identify significant power
    # Find the indices of frequency bins exceeding the threshold
    significant_bins = np.where(normalized_spectrum > th)[0]
    if len(significant_bins) == 0:
        bandwidth = 0
    else:
        # Calculate the bandwidth as the range between the lowest and highest significant frequency bins
        bandwidth = np.max(significant_bins) - np.min(significant_bins)

    return bandwidth


def fft_pos_stats(fft):
    """
    return positional statistics on the fft
    :param fft: fft of the status of the wallet
    :return: max, min, average and median of the fft
    """
    return np.max(fft), np.min(fft), np.mean(fft), np.median(fft)


def create_features(df, time_window_length):
    """
    Computes and returns all the features given a dataframe of transactions
    :param df: (DataFrame) contains all the transactions
    :param time_window_length: the time window used for feature computation
    :return: a DataFrame with only one line for the address with columns equal to all the features
    """
    new_row = pd.DataFrame()

    # Txs stats
    txs, txs_in, txs_out, relative_avg_days, relative_avg_weeks, relative_avg_months, avg_days, avg_weeks, avg_months = \
        txs_stats(df, time_window_length)
    new_row['txs'], new_row['txs_in'], new_row['txs_out'] = [
        txs, txs_in, txs_out]
    new_row['relative_avg_days'], new_row['relative_avg_weeks'], new_row['relative_avg_months'] = [relative_avg_days,
                                                                                                   relative_avg_weeks,
                                                                                                   relative_avg_months]
    new_row['avg_days'], new_row['avg_weeks'], new_row['avg_months'] = [
        avg_days, avg_weeks, avg_months]

    # Amount stats
    avg_amount, max_amount, min_amount, avg_amount_usd, max_amount_usd, min_amount_usd = amount_stats_positive(
        df)
    range_amount, ratio_amount = compute_range_ratio(
        max_amount, min_amount, avg_amount)
    range_amount_usd, ratio_amount_usd = compute_range_ratio(
        max_amount_usd, min_amount_usd, avg_amount_usd)
    new_row['avg_amount'], new_row['max_amount'], new_row['min_amount'] = [
        avg_amount, max_amount, min_amount]
    new_row['avg_amount_usd'], new_row['max_amount_usd'], new_row['min_amount_usd'] = [avg_amount_usd, max_amount_usd,
                                                                                       min_amount_usd]
    new_row['range_amount'], new_row['ratio_amount'], new_row['range_amount_usd'], new_row['ratio_amount_usd'] = [
        range_amount, ratio_amount, range_amount_usd, ratio_amount_usd]

    avg_amount_negative, max_amount_negative, min_amount_negative, avg_amount_usd_negative, max_amount_usd_negative, \
        min_amount_usd_negative = amount_stats_negative(df)
    range_amount_negative, ratio_amount_negative = compute_range_ratio(max_amount_negative, min_amount_negative,
                                                                       avg_amount_negative)
    range_amount_usd_negative, ratio_amount_usd_negative = compute_range_ratio(max_amount_usd_negative,
                                                                               min_amount_usd_negative,
                                                                               avg_amount_usd_negative)
    new_row['avg_amount_negative'], new_row['max_amount_negative'], new_row['min_amount_negative'] = [
        avg_amount_negative, max_amount_negative, min_amount_negative]
    new_row['avg_amount_usd_negative'], new_row['max_amount_usd_negative'], new_row['min_amount_usd_negative'] = [
        avg_amount_usd_negative, max_amount_usd_negative, min_amount_usd_negative]
    new_row['range_amount_negative'], new_row['ratio_amount_negative'], new_row['range_amount_usd_negative'], new_row[
        'ratio_amount_usd_negative'] = [range_amount_negative, ratio_amount_negative, range_amount_usd_negative,
                                        ratio_amount_usd_negative]

    # Distance stats
    max_distance, min_distance, mean = distance_stats(df)
    range_distance, ratio_distance = compute_range_ratio(
        max_distance, min_distance, mean)
    new_row['max_distance'], new_row['min_distance'], new_row['avg_distance'] = [
        max_distance, min_distance, mean]
    new_row['range_distance'], new_row['ratio_distance'] = [
        range_distance, ratio_distance]

    # Activity stats
    new_row['activity'], new_row['inactivity_period'] = activity_stats(df)

    # Fft stats
    sorted_days_ftt_base, sorted_days_freq, sorted_week_fft_base, sorted_week_freq, sorted_month_fft_base, \
        sorted_month_freq = ffts(df, time_window_length)

    sorted_days_ftt = np.abs(sorted_days_ftt_base)
    sorted_week_fft = np.abs(sorted_week_fft_base)
    sorted_month_fft = np.abs(sorted_month_fft_base)

    days_bw = bw(sorted_days_ftt)
    weeks_bw = bw(sorted_week_fft)
    months_bw = bw(sorted_month_fft)
    new_row['days_bw'], new_row['weeks_bw'], new_row['months_bw'] = [
        days_bw, weeks_bw, months_bw]

    max_fft_days, min_fft_days, mean_fft_days, median_fft_days = fft_pos_stats(
        sorted_days_ftt)
    range_fft_days, ratio_fft_days = compute_range_ratio(
        max_fft_days, min_fft_days, mean_fft_days)
    new_row['max_fft_days'], new_row['min_fft_days'], new_row['mean_fft_days'], new_row['median_fft_days'] = [
        max_fft_days, min_fft_days, mean_fft_days, median_fft_days]
    new_row['range_fft_days'], new_row['ratio_fft_days'] = [
        range_fft_days, ratio_fft_days]

    max_fft_weeks, min_fft_weeks, mean_fft_weeks, median_fft_weeks = fft_pos_stats(
        sorted_week_fft)
    range_fft_weeks, ratio_fft_weeks = compute_range_ratio(
        max_fft_weeks, min_fft_weeks, mean_fft_weeks)
    new_row['max_fft_weeks'], new_row['min_fft_weeks'], new_row['mean_fft_weeks'], new_row['median_fft_weeks'] = [
        max_fft_weeks, min_fft_weeks, mean_fft_weeks, median_fft_weeks]
    new_row['range_fft_weeks'], new_row['ratio_fft_weeks'] = [
        range_fft_weeks, ratio_fft_weeks]

    max_fft_months, min_fft_months, mean_fft_months, median_fft_months = fft_pos_stats(
        sorted_month_fft)
    range_fft_months, ratio_fft_months = compute_range_ratio(
        max_fft_months, min_fft_months, mean_fft_months)
    new_row['max_fft_months'], new_row['min_fft_months'], new_row['mean_fft_months'], new_row['median_fft_months'] = [
        max_fft_months, min_fft_months, mean_fft_months, median_fft_months]
    new_row['range_fft_months'], new_row['ratio_fft_months'] = [
        range_fft_months, ratio_fft_months]

    return new_row


def compute_rating(address, transactions, xg_boost, logistic, logistic_scaler):
    # --------------------------------PARAMETERS-----------------------------------------------------------
    txs_threshold = 3  # Min number of txs to consider the address
    # Number of days in the time window for the txs to take into account
    time_window_length = 90
    # API key for the download of btc prices
    api_key = os.environ['BTC_API_KEY']
    # -----------------------------------------------------------------------------------------------------

    if "txs" in transactions:  # Check if the attribute is present
        tx_list = transactions["txs"]
    else:
        return -1  # Returns -1 for non-valid addresses

    if len(tx_list) >= txs_threshold:
        # The end of the observation period
        end_timestamp = max(tx['time'] for tx in tx_list)
        end_time_window = datetime.fromtimestamp(end_timestamp)
        start_time_window = end_time_window - timedelta(
            days=time_window_length)  # Start of the window for feature computation
        start_timestamp = int(start_time_window.timestamp())
        tx_list = [tx for tx in tx_list if start_timestamp <=
                   tx["time"] <= end_timestamp]
        tx_num = len(tx_list)

        if tx_num >= txs_threshold:
            wallet_id = -1
            txs_df = pd.DataFrame(
                columns=['hash', 'wallet_id', 'amount', 'amount_usd', 'time'])
            btc_usd = download_btc_price(start_time_window, api_key)

            if btc_usd is None:
                return -2

            for tx in tx_list:
                timestamp = tx['time']
                time = datetime.fromtimestamp(timestamp)
                tx_inputs = tx['inputs']
                tx_outputs = tx['out']
                day = time.date()
                day = day.strftime("%Y-%m-%d")
                btc_price = btc_usd.at[day, "close"]
                amount = 0

                # Iterates over the inputs of the transactions (senders)
                for tx_input in tx_inputs:
                    if "prev_out" in tx_input:  # Check if the attribute is present
                        tx_input_prev_out = tx_input['prev_out']
                        if "addr" in tx_input_prev_out:  # Check if the attribute is present
                            addr = tx_input_prev_out['addr']
                            if addr == address:  # Check if the address in the transaction matches the considered wallet
                                # If sender the amount is negative
                                amount -= tx_input_prev_out['value']

                # Iterates over the outputs of the transactions (receivers)
                for tx_output in tx_outputs:  # Iterate for every output of the tx
                    if "addr" in tx_output:
                        addr = tx_output['addr']
                        if addr == address:
                            # If receiver the amount is positive
                            amount += tx_output['value']

                new_row = {'hash': tx['hash'], 'wallet_id': wallet_id, 'amount': amount,
                           'amount_usd': amount * btc_price * 10 ** (-8), 'time': time}
                new_row = pd.DataFrame([new_row])
                txs_df = pd.concat([txs_df, new_row], ignore_index=True)

            sample = create_features(txs_df, time_window_length)
            sample.fillna(0, inplace=True)

            # XgBoost prediction
            xg_boost_rating = xg_boost.predict_proba(sample)[0][1]

            # Logistic prediction
            logistic_sample = logistic_scaler.transform(sample)
            logistic_rating = logistic.predict_proba(logistic_sample)[0][1]

            # Ensemble average
            rating = (xg_boost_rating + logistic_rating)/2

            return round(rating * 100)

        else:
            return -1  # Returns -1 if we don't have enough txs to compute the features
    else:
        return -1  # Returns -1 if we don't have enough txs to compute the features
