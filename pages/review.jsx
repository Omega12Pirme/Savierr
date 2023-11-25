import CampaignFactory from '../artifacts/contracts/Campaign.sol/CampaignFactory.json'
  
const marketplaceAddress = "0xb802d6AF3924A1386038bA69DF29d996B4cA172E";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Buy from  "../components/buys"
import Memos from "../components/memos";



function Review() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = marketplaceAddress;
      const contractABI =  CampaignFactory.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(account);
          setState({ provider, signer, contract });
        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);
  // console.log(state);
  return (
    <div className ="cnt" style={{ backgroundColor: "", height: "100%" }}>
      {/* <img src={chai} className="img-fluid" alt=".." height={556} width={742} /> */}
      <div className="container">
        <Buy state={state} />
        <Memos state={state} />
      </div>
    </div>
  );
}

export default Review;