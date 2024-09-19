import React, { useContext } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { MyContext } from "../context/context";
import "../App.css";

const Wallet = () => {
  const { connectwallet, State, Isconnected } = useContext(MyContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!Isconnected ? (
        <button
          onClick={connectwallet}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="mt-4 text-center">
          <h1 className="text-xl font-semibold">Connected Account:</h1>
          <p className="text-lg text-gray-700">{State.account}</p>
          <h1 className="text-xl font-semibold">Balance:</h1>
          <p className="text-lg text-gray-700">{State.balance} MAIC</p>
        </div>
      )}
    </div>
  );
};

export default Wallet;
