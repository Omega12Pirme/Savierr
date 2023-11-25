import styled from "styled-components";
import { ethers } from "ethers";
import { useState } from "react";
import { useBiconomy } from "../../Hooks/BiconomyContext";
import { useEffect, useRef } from 'react'
const networks = {
  polygon: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Testnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  },
};


const Wallet = () => {
  const { smartAccount, smartAccountAddress, connect } = useBiconomy();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // This effect will run once when the component mounts
    setAddress(smartAccountAddress);
  }, [smartAccountAddress]);

  

  const login  = async () =>{
    setLoading(true);
    setAddress(smartAccountAddress);
    setLoading(false);
  }

  const logOut = async () => {
    setAddress('');
    setLoading(true); // Show loading state while disconnecting

    // Add logic to disconnect or log out
    // Example: await disconnect(); // You might need to implement this function

    setLoading(false); // Set loading state back to false after disconnection
  }
  // const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");


  return (
    <ConnectWalletWrapper onClick={connect}>
      {!loading && !address && <button onClick={login} className={''}>Connect to Web3</button>}
                    {loading && <p>Loading Smart Account...</p>}
                    {address && <h2>Smart Account: {smartAccountAddress.slice(0,6)}...{smartAccountAddress.slice(39)}</h2>}
                    
                   <div className="px-2">{address && <button onClick={logOut} className={''}>Logout</button>}</div>
    </ConnectWalletWrapper>
  );
};

const ConnectWalletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 5px 9px;
  height: 100%;
  color: ${(props) => props.theme.color};
  border-radius: 10px;
  margin-right: 15px;
  font-family: 'Roboto';
  font-weight: bold;
  font-size: small;
  cursor: pointer;
`;

const Address = styled.h2`
    background-color: ${(props) => props.theme.bgSubDiv};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px 0 5px;
    border-radius: 10px;
`

const Balance = styled.h2`
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-right: 5px;
`

export default Wallet;