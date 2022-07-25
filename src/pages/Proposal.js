import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table, Button } from "web3uikit";
import { Link,useLocation } from "react-router-dom";
import { ethers } from "ethers";
import molochABI from "../abis/Moloch.json"
import tokenABI from "../abis/Token.json"

// addresses on aws
const molochAddress = "0x3155755b79aa083bd953911c92705b7aa82a18f9";
const tokenAddress = "0x3347b4d90ebe72befb30444c9966b2b990ae9fcb";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const token = new ethers.Contract(tokenAddress,tokenABI.abi,provider);
const moloch = new ethers.Contract(molochAddress,molochABI.abi,provider);

async function sponsorProposal(data){
  const  signer = provider.getSigner();
  // get proposal id
  // check if member
  // check if allowance is there
  await moloch.connect(signer).sponsorProposal(data);
  console.log("proposal sponsored");
}
 async function castVote(vote,data){
  const  signer = provider.getSigner();

  // check if it is sponsored this can be done when fetching the data

  if(vote===true){
    await moloch.connect(signer).submitVote(data,1) // proposalIndex, uintVote
  }else{
    await moloch.connect(signer).submitVote(data,0) // proposalIndex, uintVote
  }
  console.log("proposal voted");
 } 

const Proposal = () => {


  const location = useLocation();
  const data = location.state;
  console.log(data);
  const proposalId = data[0];
  const proposalIndex = data[1];
  return (
    <>
      <div className="contentProposal">
        <div className="proposal">
          <Link to="/">
            <div className="backHome">
              <Icon fill="#ffffff" size={20} svg="chevronLeft" />
              Overview
            </div>
          </Link>
          <div>Should we accept offer for the dao</div>
          <div className="proposalOverview">
            <div className="proposer">
              <span>Proposed By </span>
              <Tooltip content={"ABCDE"}>
                <Blockie seed={"ABCDEFG"} />
              </Tooltip>
            </div>
          </div>
        </div>

          <Button
            onClick={(e)=> {
              try{
                //console.log(data);
                sponsorProposal(proposalId);

              }catch(e){
                console.log(e);

              }
            }}
            text="Sponsor proposal"
          />
          <Form
            style={{
              width: "35%",
              height: "250px",
              border: "1px solid rgba(6, 158, 252, 0.2)",
            }}
            buttonConfig={{
              isLoading: false,
              loadingText: "Casting Vote",
              text: "Vote",
              theme: "secondary",
            }}
            data={[
              {
                inputWidth: "100%",
                name: "Cast Vote",
                options: ["For", "Against"],
                type: "radios",
                validation: {
                  required: true,
                },
              },
            ]}
            onSubmit={(e) => {
              if (e.data[0].inputResult[0] === "For") {
                castVote(true,proposalIndex);
              } else {
                castVote(false,proposalIndex);
              }
              //setSub(true);
            }}
            title="Cast Vote"
          />
     </div>
     <div className = "votingsDiv">

     </div>
      <div className="voting"></div>
    </>
  );
};

export default Proposal;
