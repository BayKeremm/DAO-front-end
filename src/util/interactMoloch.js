

import molochABI from "../abis/Moloch.json";
const molochAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const provider = new ethers.providers.Web3Provider(window.ethereum);

export const molochContract = new ethers.Contract(molochAddress,molochABI.abi,provider);

export const submitProposal = async () => {

    
};