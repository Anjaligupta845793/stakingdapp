// src/components/StakeRow.js
import React, { useState } from "react";

const StakeRow = ({ title, value }) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className={`text-gray-600 ${value ? "text-blue-600" : ""}`}>{value}</p>
    </div>
  );
};

export default StakeRow;
