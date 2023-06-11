const UNSAFE_THRESHOLD = 50;
const DANGER_THRESHOLD = 70;
const UNRANKED_STATUS = 404;

function getColorBasedOnRank(rank) {
  if (rank <= UNSAFE_THRESHOLD) {
    return {
      border: "border-red-500",
      bg: "bg-red-500",
      text: "text-red-500",
    };
  }
  if (rank <= DANGER_THRESHOLD) {
    return {
      border: "border-yellow-500",
      bg: "bg-yellow-500",
      text: "text-yellow-500",
    };
  }
  return {
    border: "border-green-500",
    bg: "bg-green-500",
    text: "text-green-500",
  };
}

function getWalletStatusBasedOnRank(rank) {
  if (rank <= UNSAFE_THRESHOLD) {
    return "Unsafe";
  }
  if (rank <= DANGER_THRESHOLD) {
    return "Dangerous";
  }
  return "Safe";
}

function walletStatusMsm({ data, error }) {
  if (!data && error && error.response?.status == UNRANKED_STATUS) {
    return (
      <p className="px-2 py-2 border border-[#ffd166] bg-[#ffd166] text-darkest-purple rounded-2xl">
        This wallet is not ranked yet. Please check back later.{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 inline-block ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </p>
    );
  }

  if (error) {
    return (
      <p className="px-2 py-2 border border-[#e63946] bg-[#e63946] text-white rounded-2xl">
        It seems like there was an error. Please try again later.{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 inline-block ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </p>
    );
  }
  if (data.rank === -1) {
    return (
      <p className="px-2 py-2 border border-[#e63946] bg-[#e63946] text-white rounded-2xl">
        This wallet does not have enough transactions to be ranked. Please check
        back later.
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 inline-block ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </p>
    );
  }
  const rankStatusMsm = getWalletStatusBasedOnRank(data.rank);

  return (
    <p>
      This wallet is ranked as{" "}
      <span className={`font-bold ${getColorBasedOnRank(data.rank).text}`}>
        {rankStatusMsm.toLowerCase()}
      </span>
      *.
    </p>
  );
}

export { walletStatusMsm, getColorBasedOnRank, getWalletStatusBasedOnRank };
