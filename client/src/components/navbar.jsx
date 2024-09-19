// src/components/NavBar.js
import React, { useContext } from "react";
import { MyContext } from "../context/context";

const NavBar = () => {
  const { connectWallet, state, claimTokens } = useContext(MyContext); // Updated to match new context structure

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center p-4 bg-blue-600 text-white">
      {/* Left Side: Claim Award Button */}
      <button
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
        onClick={claimTokens}
      >
        Claim Award
      </button>

      {/* Right Side: Two Buttons */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-2 md:mt-0">
        <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto">
          {state.chainId === "80002" ? <p>Polygon</p> : <p>Unsupported</p>}
        </button>
        <button
          onClick={connectWallet}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          {state.isConnected && state.account ? (
            `${state.account.slice(0, 6)}...`
          ) : (
            <p>Connect</p>
          )}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
