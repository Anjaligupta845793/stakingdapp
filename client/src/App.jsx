import { useContext, useState } from "react";

import NavBar from "./components/navbar";
import Stake from "./components/stake";
import { Toaster } from "react-hot-toast";

import "./App.css";
function App() {
  return (
    <>
      <Toaster />
      <NavBar />
      <Stake />
    </>
  );
}

export default App;
