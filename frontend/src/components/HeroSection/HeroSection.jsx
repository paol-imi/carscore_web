import HeroBgUrl from "./hero-bg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WalletSearch from "../WalletSearch/";
import { useUser } from "../../context/user-context";
function HeroSection() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");

  function handleWalletAddressChange(event) {
    setWalletAddress(event.target.value);
  }
  async function handleSearchClick() {
    navigate(`/result/${walletAddress}`);
  }
  return (
    <div className="flex flex-col w-full justify-center h-screen relative">
      {/* Hero / Main Funct*/}
      <img
        src={HeroBgUrl}
        className="absolute right-0 -z-10 w-[630px] top-28"
        alt="Sphere composed by nodes"
        srcSet=""
      />
      <div id="hero" className="flex-1 text-white">
        <div className="flex px-12 md:px-0 w-full flex-col gap-4 h-full justify-center items-center">
          <h1 className="text-center text-lg">
            <span className=" text-[28px]">C</span>rypto{" "}
            <span className=" text-[28px]">A</span>nti-fraud{" "}
            <span className=" text-[28px]">R</span>ating{" "}
            <span className=" text-[28px]">S</span>ystem
          </h1>
          <div className="w-full max-w-md mt-6">
            <WalletSearch
              walletAddress={walletAddress}
              handleWalletAddressChange={handleWalletAddressChange}
              handleSearchClick={handleSearchClick}
            />
          </div>
        </div>
      </div>
      {/* First Section */}
    </div>
  );
}

export default HeroSection;
