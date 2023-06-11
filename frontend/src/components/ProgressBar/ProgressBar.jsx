import React from "react";
import ProgressBarLib from "@ramonak/react-progress-bar";

function ProgressBar({ completed = 0, customClasses = "", loadingText = "" }) {
  return (
    <div
      className="flex w-full flex-col items-center gap-3"
      id="loading-zone"
      aria-busy="true"
    >
      <ProgressBarLib
        bgColor="#F5F5F5"
        height="3px"
        baseBgColor="#CB31E4"
        completed={completed}
        className={`rounded-[10px] flex-grow-0 w-[250px] mx-auto px-4 ${customClasses}`}
        maxCompleted={100}
      />
      <span className="text-white">{loadingText}</span>
    </div>
  );
}

export default ProgressBar;
