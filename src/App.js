import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import { ConnectButton } from "web3uikit";


const App = () => {
  return (
    <>
      <div className="header">
        <ConnectButton />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal/:id" element={<Proposal />} />
      </Routes>
    </>
  );
};

export default App;