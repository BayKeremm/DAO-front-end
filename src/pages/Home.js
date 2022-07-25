import React, { useEffect, useState } from "react";
import "./pages.css";
import { TabList, Tab, Widget, Tag, Table, Form, Button } from "web3uikit";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useForm } from 'react-hook-form';
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
    processed
    proposer
  	sponsored
    details
    proposalIndex
	}
  }
}
`
const client = createClient({
  url:APIURL
})

const provider = new ethers.providers.Web3Provider(window.ethereum);
const molochAddress = "0x3155755b79aa083bd953911c92705b7aa82a18f9";
const tokenAddress = "0x3347b4d90ebe72befb30444c9966b2b990ae9fcb";
const token = new ethers.Contract(tokenAddress,tokenABI.abi,provider);
const moloch = new ethers.Contract(molochAddress,molochABI.abi,provider);


// addresses on aws
//const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//const molochAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
//const molochAddress = "0x3155755b79aa083bd953911c92705b7aa82a18f9";
//const tokenAddress = "0x3347b4d90ebe72befb30444c9966b2b990ae9fcb";

async function createProposal(details,sharesRequested,tributeOffered){
  const  signer = provider.getSigner();
  // create proposal
  //address applicant,
  //uint256 sharesRequested,
  //uint256 lootRequested,
  //uint256 tributeOffered,
  //address tributeToken,
  //uint256 paymentRequested,
  //address paymentToken,
  //string memory details
  console.log(signer.getAddress());
  const res  = await moloch.connect(signer).submitProposal(signer.getAddress(),sharesRequested,0,tributeOffered,token.address,0,token.address,details)
  console.log(res);
  console.log("proposal submitted");
}

async function increaseAllowance(){
  const  signer = provider.getSigner();

  const res = await token.connect(signer).increaseAllowance(moloch.address,5000);
  console.log(res);
  console.log("increased allowance")
}

const Home = () => {
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
      <Tag color="blue" text={e.sponsored ? "yes":"no"} />,
      <Link to="/proposal" state={[e.proposalId,e.proposalIndex, e.processed,e.details,e.proposer]}>
      <Tag color="blue" text={e.processed ? "yes":"no"} />,
      </Link>,
  ])
    
  setDatas(table)
    
}
const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => {console.log(data); createProposal(data.details,data.sharesRequested,data.tributeOffered);}
  console.log(errors);

  return (
    <>
      <div className="content">
        <TabList defaultActiveKey={1} tabStyle="bulbUnion">
          <Tab tabKey={1} tabName="DAO">
            <div className = "tabContent"> 
              Recent Proposals
              <div style={{marginTop: "30px"}}>
                <Table
                columnsConfig="25% 25% 25% 25%"
                data={datas}
                header={[
                  <span>ID</span>,
                  <span>DETAILS</span>,
                  <span>SPONSORED</span>,
                  <span>PROCESSED</span>,
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
                <h3 style={{ color: 'black' }}>New Proposal</h3>
                <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="number" placeholder="sharesRequested" {...register("sharesRequested", {})} />
                  <input type="number" placeholder="tributeOffered" {...register("tributeOffered", {})} />
                  <input type="text" placeholder="details" {...register("details", {})} />

                  <input type="submit" />
                </form>

                </div>
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