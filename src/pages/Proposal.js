import React, { useState, useEffect } from "react";
import "./pages.css";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table, Button } from "web3uikit";
import { Link,useLocation } from "react-router-dom";
import { ethers } from "ethers";
import molochABI from "../abis/Moloch.json"
import tokenABI from "../abis/Token.json"
import {createClient} from 'urql'
const PROPOSALDEPOSIT = 300;

const APIURL = "http://f587-54-87-32-29.ngrok.io/subgraphs/name/daodesigner/moloch-subgraph"

const membersQuery = `
query MyQuery {
  moloch(id: "0x3155755b79aa083bd953911c92705b7aa82a18f9") {
    members {
      memberAddress
    }
  }
}
`
const client = createClient({
  url:APIURL
})

// addresses on aws
const molochAddress = "0x3155755b79aa083bd953911c92705b7aa82a18f9";
const tokenAddress = "0x3347b4d90ebe72befb30444c9966b2b990ae9fcb";

const provider = new ethers.providers.Web3Provider(window.ethereum);

const token = new ethers.Contract(tokenAddress,tokenABI.abi,provider);
const moloch = new ethers.Contract(molochAddress,molochABI.abi,provider);

async function sponsorProposal(id){
  const  signer = provider.getSigner();
  const address = await signer.getAddress();
  // check balance
  const balance = await token.connect(signer).balanceOf(address);
  if(balance._hex < PROPOSALDEPOSIT){
    console.log("balance is",await token.connect(signer).balanceOf(address));
    console.log("Balance less than proposal deposit")
    return
  }

  // check allowance 
  const allowance =   await token.connect(signer).allowance(signer.getAddress(),molochAddress);
  if(allowance._hex < PROPOSALDEPOSIT){
    console.log("allowance to the moloch",await token.connect(signer).allowance(signer.getAddress(),molochAddress));
    console.log("allowance less than proposal deposit")
    return
  }
  try{
    await moloch.connect(signer).sponsorProposal(id);
    console.log("proposal sponsored");
  }catch(err) {
    console.log(err);
  }    
}  

async function processProposal(index){
  const  signer = provider.getSigner();
  try{
    await moloch.connect(signer).processProposal(index);
    console.log("proposal processed");
  }catch(err) {
    console.log(err);
  }    
}

 async function castVote(vote,data){
  const  signer = provider.getSigner();
  //check if member
    try{
      console.log(data);
      await moloch.connect(signer).submitVote(data,vote) // proposalIndex, uintVote
    }catch(err) {
      console.log(err);
      console.log("vote reverted");
      return
    }    
    console.log("proposal voted");
    return
 } 

const Proposal = () => {
const [members, setMembers] = useState([])
useEffect(()=>{
  fetchMembers()
},[]);

async function fetchMembers(){
  const response = await client.query(membersQuery).toPromise()
  console.log('response',response.data.moloch.members)
  setMembers(response.data.moloch.members);
    
}



  const location = useLocation();
  const data = location.state;
  const proposalId = data[0];
  const proposalIndex = data[1];
  const processed = data[2];
  const details = data[3];
  const proposer = data[4];
  const sponsored = data[5];
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
          <div>{details}</div>
          <div className="proposalOverview">
            <div className="proposer">
              <span>Proposed By </span>
              <Tooltip content={proposer}>
                <Blockie seed={proposer} />
              </Tooltip>
            </div>
          </div>
        </div>

          <Button
            onClick={(e)=> {
              if(sponsored === true){
                console.log("This proposal is already sponsored")
              }else{
                try{
                  //console.log(data);
                  sponsorProposal(proposalId);

                }catch(e){
                  console.log(e);

                }
              }
            }}
            text="Sponsor proposal"
          />
          <Button
            onClick={(e)=> {
              try{
                //console.log(data);
                if (processed === true){
                  // log already processed
                  console.log("This proposal is already processed")

                } else {
                  // process proposal
                  processProposal(proposalIndex);
                }

              }catch(e){
                console.log(e);

              }
            }}
            text = "process proposal"
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
              if(processed === true){
                console.log("This proposal is processed you cannot vote")
              }else{
                if (e.data[0].inputResult[0] === "For") {
                  castVote(1,proposalIndex);
                } else {
                  castVote(0,proposalIndex);
                }
              }
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
