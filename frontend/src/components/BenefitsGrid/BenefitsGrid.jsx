import React from "react";
import GreenRectUrl from "./green-rect.png";
import PurpleRectUrl from "./purple-rect.png";
function BenefitsGrid({ freeAuxText = "", premiumAuxText = "" }) {
  return (
    <div className="relative  max-w-[620px] mx-auto mt-[70px] px-4 md:px-0">
      <div className="border-b border-white/20 grid grid-cols-8 pb-4">
        <span className="col-span-4"></span>
        <span className="text-lg md:text-xl col-span-2 text-white text-center md:text-black">
          Free trial
        </span>
        <span className="text-lg md:text-xl col-span-2 text-white text-center md:text-black">
          Premium
        </span>
      </div>
      {Row({ text: "Wallet", freeTrial: true, premium: true })}
      {Row({
        text: "In-depth analysis report",
        freeTrial: false,
        premium: true,
      })}
      {/* {Row({ text: "Transaction history", freeTrial: false, premium: true })}
      {Row({ text: "Search log", freeTrial: false, premium: true })} */}
      {Row({
        text: "Api access",
        freeTrial: false,
        premium: true,
      })}
      <div className="pt-2 grid grid-cols-8">
        <span className="col-span-4"></span>
        <span className="col-span-2 flex justify-center items-center text-white md:text-black font-bold text-center">
          <CheckSvg
            className={`inline-block mr-2 w-5 h-5  ${
              !freeAuxText ? "hidden" : ""
            }`}
            width={2.5}
          />
          {freeAuxText}
        </span>
        <span className="col-span-2 text-white md:text-black font-bold text-center">
          {premiumAuxText}
        </span>
      </div>
      <div className="hidden md:block absolute -top-10 right-[142px] w-[175px] -z-10">
        <img src={PurpleRectUrl} alt="" />
      </div>
      <div className="hidden md:block absolute -top-10 -right-[16px] w-[175px] -z-10">
        <img src={GreenRectUrl} alt="" />
      </div>
    </div>
  );
}
function Row({ text, freeTrial, premium, withBorder = true, isLast }) {
  let border = isLast ? "" : "border-b border-white/20";
  if (!withBorder) {
    border = "";
  }
  return (
    <div className={`py-2 grid grid-cols-8 ${border}`}>
      <span className="col-span-4">{text}</span>
      <span className="col-span-2 text-center text-white md:text-black">
        {freeTrial ? <CheckSvg /> : "-"}
      </span>
      <span className="col-span-2 text-center text-white md:text-black">
        {premium ? <CheckSvg /> : "-"}
      </span>
    </div>
  );
}

function CheckSvg({ className = "", width = 3 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={width}
      stroke="currentColor"
      className={`w-6 h-6 mx-auto` + className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}

export default BenefitsGrid;
