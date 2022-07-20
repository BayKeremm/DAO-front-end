import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, Button } from "web3uikit";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import molochABI from "../abis/Moloch.json"
import tokenABI from "../abis/Token.json"


async function createProposal(details){
  const summoner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const account3 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const molochAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const moloch = new ethers.Contract(molochAddress,molochABI.abi,provider);
  const token = new ethers.Contract(tokenAddress,tokenABI.abi,provider);
  // check allowance
  const res = await token.allowance(summoner,molochAddress);
  console.log(res._hex);
  if(res._hex === "0x00"){
    console.log("not enough allowance")
    return
  }
  console.log("after")
  //const totalSupply = await token.totalSupply();
  //console.log("fetched token and copied token",totalSupply);

}

const Home = () => {
  const [proposals, setProposals] = useState([
    [
      1,
      <div>Should we start a Moralis hamburger chain?</div>,
      <Tag color="green" text="Passed" />,
    ],
    [
      2,
      "Should we accept Elon Musks $44billion offer for our DAO?",
      <Link to="/proposal" state={"hello"}>
        <Tag color="red" text="Rejected" />
      </Link>,
    ],
    [
      3,
      "Do you want a Web3 Slack tutorial?",
      <Tag color="blue" text="Ongoing" />,
    ],
    [
      4,
      "Are you interested in Xbox/Console web3 tutorials?",
      <Tag color="blue" text="Ongoing" />,
    ],
    [
      5,
      "Would you attend a Moralis Builder get together in Miami?",
      <Tag color="blue" text="Ongoing" />,
    ],
]);


  

  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
            <div className = "tabContent"> 
              Recent Proposals
              <div style={{marginTop: "30px"}}>
                <Table
                columnsConfig="10% 70% 20%"
                data={proposals}
                header={[
                  <span>ID</span>,
                  <span>Description</span>,
                  <span>Status</span>,
                ]}
                pageSize={5}
                />
              </div>
              <Button
                //onClick={function noRefCheck(){}}
                text="Button"
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