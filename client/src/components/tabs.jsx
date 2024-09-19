// src/components/Tabs.js
import React, { useState, useContext } from "react";
import { MyContext } from "../context/context";
const Tabs = () => {
  const [activeTab, setActiveTab] = useState("stake");
  const {
    approveAmount,
    handleApproveInputChange,
    approveStakToken,
    userStakInput,
    userStakInputChangeHandler,
    stakTokenHandler,
    withdrawInput,
    withdrawInputChangeHandler,
    withdrawTokens,
  } = useContext(MyContext);

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        {/* Tabs */}
        <div className="flex justify-center mb-4 space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "stake"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("stake")}
          >
            Stake
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "withdraw"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("withdraw")}
          >
            Withdraw
          </button>
        </div>

        {/* Conditional Rendering Based on Active Tab */}
        {activeTab === "stake" ? (
          <div className="flex flex-col mt-4 space-y-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Total Approved"
                className="w-full p-2 border rounded"
                value={approveAmount}
                onChange={handleApproveInputChange}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 "
                onClick={approveStakToken}
              >
                Token Approve
              </button>
            </div>

            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Lesser Approved Amount"
                className="w-full p-2 border rounded"
                value={userStakInput}
                onChange={userStakInputChangeHandler}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
                onClick={stakTokenHandler}
              >
                Stake Token
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-4 space-y-4">
            {/* Withdraw-related UI goes here */}
            <h2 className="text-xl font-semibold">Withdraw Amount</h2>
            <input
              type="text"
              placeholder="Amount to Withdraw"
              className="w-full p-2 border rounded"
              value={withdrawInput}
              onChange={withdrawInputChangeHandler}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2"
              onClick={withdrawTokens}
            >
              Withdraw Tokens
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
