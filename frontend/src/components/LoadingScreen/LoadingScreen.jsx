import React, { useState, useEffect } from "react";
import ProgressBar from "../ProgressBar/";

function LoadingScreen({ progress }) {
  return (
    <div className="relative min-h-screen flex justify-center items-center bg-main-gradient z-10">
      <ProgressBar completed={progress} loadingText="Loading..." />
    </div>
  );
}

export default LoadingScreen;
