import React from "react";
import Founder1 from "./founder1.png";
import Founder2 from "./founder2.png";
import Founder3 from "./founder3.png";
import Founder4 from "./founder4.png";
import Founder5 from "./founder5.png";
import TeamCard from "../TeamCard";
import { foundersInfo } from "../../data/text";
function Team() {
  return (
    <div id="team" className="bg-darkest-purple pt-32 pb-[160px]">
      <div className="p-10">
        <h3 className="text-[32px] text-main-purple font-bold text-center ">
          Team
        </h3>
        <div className="flex gap-10 mt-10 flex-wrap justify-center max-w-[700px] mx-auto">
          <TeamCard founder={foundersInfo[0]} imgUrl={Founder1} />
          <TeamCard founder={foundersInfo[1]} imgUrl={Founder2} />
          <TeamCard founder={foundersInfo[2]} imgUrl={Founder3} />
          <TeamCard founder={foundersInfo[3]} imgUrl={Founder4} />
          <TeamCard founder={foundersInfo[4]} imgUrl={Founder5} />
        </div>
      </div>
    </div>
  );
}

export default Team;
