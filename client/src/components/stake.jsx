// src/components/Stake.js
import React from "react";
import StakeRow from "./StakeRow"; // Import the new StakeRow component
import Tabs from "./tabs";
import { useContext } from "react";
import { MyContext } from "../context/context";

const Stake = () => {
  const { rewardRate, stakedAmount, rewards } = useContext(MyContext);
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        {/* Use StakeRow for displaying data */}
        <StakeRow title="Staked Amount" value={stakedAmount} />
        <StakeRow title="Reward Rate" value={rewardRate} />
        <StakeRow title="Earned Reward" value={rewards} />
      </div>
      <Tabs />
    </div>
  );
};

export default Stake;
