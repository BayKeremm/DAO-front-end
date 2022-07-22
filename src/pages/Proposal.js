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

async function sponsorProposal(data){
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const  signer = provider.getSigner();
  const moloch = new ethers.Contract(molochAddress,molochABI.abi,signer);
  const address = await signer.getAddress();
  // get proposal id
  // check if member
  // check if allowance is there
  await moloch.sponsorProposal(data);
  console.log("proposal sponsored");
}
 async function castVote(vote,data){
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const  signer = provider.getSigner();
  const moloch = new ethers.Contract(molochAddress,molochABI.abi,signer);
  const address = await signer.getAddress();

  // check if it is sponsored this can be done when fetching the data

  if(vote===true){
    await moloch.submitVote(data,1) // proposalIndex, uintVote

  }else{
    await moloch.submitVote(data,0) // proposalIndex, uintVote
  }
  console.log("proposal voted");
 } 

const Proposal = () => {
  const location = useLocation();
  const data = location.state;
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
            <Tag color={"red"} text={"Rejected"} />
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
                sponsorProposal(data);

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
                castVote(true,data);
              } else {
                castVote(false,data);
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
