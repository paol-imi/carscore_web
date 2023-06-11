import React from "react";

import BenefitsGrid from "../BenefitsGrid";

function Premium() {
  return (
    <div className="pb-56 pt-24 text-white" id="premium">
      <h3 className="text-2xl text-main-purple font-bold text-center">
        Premium
      </h3>
      <p className="max-w-[565px] mx-auto mt-6 px-4">
        With a premium subscription you gain access to in-depth reports – so you
        can take better and well-informed decisions – alongside other useful
        features.{" "}
      </p>
      <div className="px-8">
        <BenefitsGrid />
      </div>
    </div>
  );
}
export default Premium;
