import React from "react";
import SearchInput from "../SearchInput/";
import { useUser } from "../../context/user-context";
import { Link } from "react-router-dom";
function WalletSearch({
  walletAddress,
  handleWalletAddressChange = () => {},
  handleSearchClick = () => {},
  isLogged = false,
}) {
  const { user } = useUser();
  isLogged = user?.id_token ? true : false;
  walletAddress = isLogged ? walletAddress : "";
  return (
    <>
      <SearchInput
        id={"walletAddress"}
        placeholder={"Enter wallet address..."}
        value={walletAddress}
        onChange={handleWalletAddressChange}
        disabled={!isLogged}
      />
      {/* show message that needs to be login to interact with the app */}
      {!isLogged && (
        <Link to="/login" className="mt-4 text-center">
          <p className="mt-4 bg-opacity-10 backdrop-blur-3xl drop-shadow-lg bg-black rounded-[10px]">
            You need to be logged in to fetch data
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 inline-block ml-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </p>
        </Link>
      )}

      <button
        onClick={handleSearchClick}
        disabled={walletAddress?.length === 0}
        className={`mx-auto mt-6 block transition-opacity duration-300 ease-in-out bg-main-purple hover:bg-main-purple/60 text-white font-bold py-2 px-4 rounded ${
          (walletAddress?.length === 0) | !isLogged
            ? "opacity-0 aria-hidden:"
            : "opacity-100"
        }`}
      >
        Search
      </button>
    </>
  );
}

export default WalletSearch;
