import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, Button } from "web3uikit";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import molochABI from "../abis/Moloch.json"
import tokenABI from "../abis/Token.json"

import {createClient} from 'urql'

const APIURL = "http://f587-54-87-32-29.ngrok.io/subgraphs/name/daodesigner/moloch-subgraph"
const query = `
query MyQuery {
  moloch(id: "0x3155755b79aa083bd953911c92705b7aa82a18f9") {
	id
	proposals {
  	proposalId
  	sponsored
    details
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

async function createProposal(details){
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const  signer = provider.getSigner();
  const moloch = new ethers.Contract(molochAddress,molochABI.abi,signer);
  const address = await signer.getAddress();
  // create proposal
  //address applicant,
  //uint256 sharesRequested,
  //uint256 lootRequested,
  //uint256 tributeOffered,
  //address tributeToken,
  //uint256 paymentRequested,
  //address paymentToken,
  //string memory details
  await moloch.submitProposal(address,0,0,1,tokenAddress,0,tokenAddress,details)
  console.log("proposal submitted");
}

async function increaseAllowance(){
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const  signer = await provider.getSigner();
  const token = new ethers.Contract(tokenAddress,tokenABI.abi,signer);

  const res = await token.increaseAllowance(molochAddress,5000);
  //console.log(res);
  console.log("increased allowance")
}

const Home = () => {
  const [proposals, setProposals] = useState([
    [
      0,
      <div>Should we start a Moralis hamburger chain?</div>,
      <Link to="/proposal" state={0}>
      <Tag color="green" text="Passed" />,
      </Link>,
    ],
    [
      1,
      "Should we accept Elon Musks $44billion offer for our DAO?",
      <Link to="/proposal" state={1}>
        <Tag color="red" text="Rejected" />
      </Link>,
    ],
    [
      2,
      "Do you want a Web3 Slack tutorial?",
      <Link to="/proposal" state={2}>
      <Tag color="blue" text="Ongoing" />,
      </Link>,
    ],
    [
      3,
      "Are you interested in Xbox/Console web3 tutorials?",
      <Link to="/proposal" state={3}>
      <Tag color="blue" text="Ongoing" />,
      </Link>,
    ],
    [
      4,
      "Would you attend a Moralis Builder get together in Miami?",
      <Link to="/proposal" state={4}>
      <Tag color="blue" text="Ongoing" />,
      </Link>,
    ],
]);

const [datas, setDatas] = useState([])
useEffect(()=>{
  fetchData()
},[]);

async function fetchData(){
  const response = await client.query(query).toPromise()
  console.log('response',response.data.moloch.proposals)
  //setDatas(response.data.moloch.proposals)
  const table = response.data.moloch.proposals.map((e) => [
      e.proposalId,
      e.details,
      <Link to="/proposal" state={e.proposalId}>
      <Tag color="blue" text={e.sponsored ? "yes":"no"} />,
      </Link>,
    ]);
  setDatas(table)
    
}

  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
            <div className = "tabContent"> 
              Recent Proposals
              <div style={{marginTop: "30px"}}>
                <Table
                columnsConfig="40% 40% 40%"
                data={datas}
                header={[
                  <span>ID</span>,
                  <span>DETAILS</span>,
                  <span>SPONSORED</span>,
                ]}
                pageSize={5}
                />
              </div>

              <Button
                onClick={(e)=> {
                  try{
                    increaseAllowance();

                  }catch(e){
                    console.log(e);

                  }
                }}
                text="Increase Allowance by 5000"
              />

              <Form
                  buttonConfig={{
                    isLoading: false,
                    loadingText: "Submitting Proposal",
                    text: "Submit",
                    theme: "secondary",
                  }}
                  data={[
                    {
                      inputWidth: "100%",
                      name: "New Proposal",
                      type: "textarea",
                      validation: {
                        required: true,
                      },
                      value: "",
                    },
                  ]}
                  onSubmit={(e) => {
                    try{
                      createProposal(e.data[0].inputResult);
                    } catch(e){
                      console.log(e);
                    }
                    
                  }}
                  title="Create a New Proposal"
                />


            </div>
          </Tab>
          <Tab tabKey={2} tabName="Forum"></Tab>
          <Tab tabKey={3} tabName="Docs"></Tab>
        </TabList>
      </div>
      <div className="voting"></div>
    </>
  );
};
export default Home;