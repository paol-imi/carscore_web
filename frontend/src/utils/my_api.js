import axios from "axios";
const BASE_URL = "https://c156boowdc.execute-api.us-east-1.amazonaws.com";

function isTokenExpired() {
  const exp = JSON.parse(localStorage.getItem("exp"));
  const exp_date = new Date(exp * 1000);
  const now = new Date();
  if (exp_date < now) {
    return true;
  }
  return false;
}

async function getWallet(addressId) {
  if (isTokenExpired()) {
    let tokenError = new Error("Token expired");
    tokenError.name = "TokenExpiredError";
    tokenError.isTokenExpired = true;
    throw tokenError;
  }

  const id_token = JSON.parse(localStorage.getItem("credential"));
  try {
    const response = await axios.get(`${BASE_URL}/address/${addressId}`, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    });

    const wallet = response.data;
    return wallet;
  } catch (error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response) {
      console.error(
        `Server responded with status code: ${error.response.status}`
      );
    }
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    else if (error.request) {
      console.error("Request was made, but no response received");
    }
    // Something happened in setting up the request that triggered an Error
    else {
      console.error("Error", error.message);
    }

    // Optionally, you can re-throw the error if you want it to be "caught" further up the chain
    throw error;
  }
}

export { getWallet, BASE_URL };
