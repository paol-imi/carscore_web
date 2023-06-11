import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen/";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import WalletSearch from "../../components/WalletSearch";
import { getWallet } from "../../utils/my_api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/user-context";
import { googleLogout } from "@react-oauth/google";
import { toast } from "react-toastify";
import {
  walletStatusMsm,
  getColorBasedOnRank,
  getWalletStatusBasedOnRank,
} from "../../utils/wallet-display";
const notifyExpireSession = () =>
  toast.warn("Your session has expired", {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

function Result() {
  const { setUser } = useUser();
  const { addr } = useParams();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(addr);

  function handleWalletAddressChange(event) {
    setWalletAddress(event.target.value);
  }
  async function handleSearchClick() {
    navigate(`/result/${walletAddress}`);
  }
  const [loadingProgress, setLoadingProgress] = useState(0);
  const walletQuery = useQuery({
    queryKey: ["wallet", addr],
    queryFn: () => {
      return getWallet(addr);
    },
    retry: false,
  });
  const isValidRank = walletQuery.data?.rank > 0;
  useEffect(() => {
    if (!walletQuery.isLoading) {
      setLoadingProgress(100);
      if (walletQuery.isError) {
        console.log(walletQuery.error);
        if (walletQuery.error.isTokenExpired) {
          googleLogout();
          setUser(null);
          notifyExpireSession();
          navigate("/login");
        }
        return;
      }
      if (!walletQuery.data) {
        return;
      }
      if (walletQuery.data.walletAddress) {
        setWalletAddress(walletQuery.data.walletAddress);
      }
    }

    const timer = setInterval(() => {
      setLoadingProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(oldProgress + 5, 100);
      });
    }, 500); // Increment progress every half second

    return () => {
      clearInterval(timer); // Clean up on component unmount
    };
  }, [walletQuery.isLoading]);
  if (walletQuery.isLoading)
    return <LoadingScreen progress={loadingProgress} />;

  return (
    <>
      <div className=" text-white bg-main-gradient min-h-screen pt-36">
        <div className="pt-34 max-w-xl px-12 md:px-0 mx-auto pb-20">
          <WalletSearch
            walletAddress={walletAddress}
            handleWalletAddressChange={handleWalletAddressChange}
            handleSearchClick={handleSearchClick}
          />
          {isValidRank && (
            <div
              id="graph"
              className="flex flex-col items-center py-4 mt-4 gap-10 md:gap-[20px] justify-center"
            >
              <div className="">
                <h3 className="text-2xl">Rank</h3>
              </div>
              <div className="">
                <div
                  id="circle"
                  className={`border-[3px] w-[235px] h-[235px] rounded-full grid content-center justify-center ${
                    getColorBasedOnRank(walletQuery.data?.rank).border
                  }`}
                >
                  <div className="text-center">
                    <p className="text-[40px] -mb-4">
                      {walletQuery.data?.rank}
                    </p>
                    ⎯⎯⎯⎯
                    <p className="text-[40px] -mt-4">100</p>
                  </div>
                </div>{" "}
                <div className="flex justify-center mt-4">
                  <span
                    className={`px-2 py-1 justify-center rounded-md ${
                      getColorBasedOnRank(walletQuery.data?.rank).bg
                    }`}
                  >
                    {getWalletStatusBasedOnRank(walletQuery.data?.rank)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="text-center mt-8">{walletStatusMsm(walletQuery)}</div>
          <p
            id="legal-disclamer"
            className="text-xs mt-10 mx-auto max-w-[350px]"
          >
            *We do our best to assess the wallets correctly. However, we take no
            legal responsibility if the result turns out to be misleading or
            incorrect. Therefore we do recommend to check out the detailed
            report.
          </p>
        </div>
      </div>
    </>
  );
}

export default Result;
