import tokenABI from "../abis/Token.json"
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.providers.Web3Provider(window.ethereum);
export const tokenContract = new ethers.Contract(tokenAddress,tokenABI.abi,provider);

export const increaseAllowance = async () => {

};