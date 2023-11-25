import React, { useState, useMemo, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { SessionKeyManagerModule, DEFAULT_SESSION_KEY_MANAGER_MODULE  } from "@biconomy/modules";
import { BiconomySmartAccountV2 } from "@biconomy/account"
import { defaultAbiCoder } from "ethers/lib/utils";
// import ERC20Transfer from "./ERC20Transfer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useBiconomy } from "./BiconomyContext";

const CreateSession= () => {
    const {provider,smartAccount, smartAccountAddress,connect} = useBiconomy();
  const [isSessionKeyModuleEnabled, setIsSessionKeyModuleEnabled] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    let checkSessionModuleEnabled = async () => {
      if(!smartAccountAddress || !smartAccount || !provider) {
        setIsSessionKeyModuleEnabled(false);
        return
      }
      try {
        const isEnabled = await smartAccount.isModuleEnabled(DEFAULT_SESSION_KEY_MANAGER_MODULE)
        console.log("isSessionKeyModuleEnabled", isEnabled);
        setIsSessionKeyModuleEnabled(isEnabled);
        return;
      } catch(error) {
        console.error(error)
        setIsSessionKeyModuleEnabled(false);
        return;
      }
    }
    checkSessionModuleEnabled()
  },[isSessionKeyModuleEnabled, smartAccountAddress, smartAccount, provider])

  const createSession = async (enableSessionKeyModule) => {
    
    if (!smartAccountAddress || !smartAccount || !provider) {
      alert("Please connect wallet first")
      return;
    }
    toast.info('Creating Session...', {
      position: "top-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    try {
      const erc20ModuleAddr = "0x000000D50C68705bd6897B2d17c7de32FB519fDA"
      // -----> setMerkle tree tx flow
      // create dapp side session key
      const sessionSigner = ethers.Wallet.createRandom();
      const sessionKeyEOA = await sessionSigner.getAddress();
      console.log("sessionKeyEOA", sessionKeyEOA);
      // BREWARE JUST FOR DEMO: update local storage with session key
      window.localStorage.setItem("sessionPKey", sessionSigner.privateKey);

      // generate sessionModule
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: smartAccountAddress,
      });

    //   create session key data
      const sessionKeyData = defaultAbiCoder.encode(
        ["address", "address", "address", "uint256"],
        [
          sessionKeyEOA,
          "0xdA5289fCAAF71d52a80A254da614a192b693e977", // erc20 token address
          "0x05f8d732692f087aDB447CaA20d27021FaEEe820", // receiver address
          ethers.utils.parseUnits("50".toString(), 6).toHexString(), // 50 usdc amount
        ]
      );

      const sessionTxData = await sessionModule.createSessionData([
        {
          validUntil: 0,
          validAfter: 0,
          sessionValidationModule: erc20ModuleAddr,
          sessionPublicKey: sessionKeyEOA,
          sessionKeyData: sessionKeyData,
        },
      ]);
      console.log("sessionTxData", sessionTxData);

    
      const setSessiontrx = {
        to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
        data: sessionTxData.data,
      };

      const transactionArray = [];

      if (enableSessionKeyModule) {
        // -----> enableModule session manager module
        const enableModuleTrx = await smartAccount.getEnableModuleData(
          DEFAULT_SESSION_KEY_MANAGER_MODULE,
        );
        transactionArray.push(enableModuleTrx);
      }

      transactionArray.push(setSessiontrx)

      let partialUserOp = await smartAccount.buildUserOp(transactionArray);

      const userOpResponse = await smartAccount.sendUserOp(
        partialUserOp
      );
      console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
      const transactionDetails = await userOpResponse.wait();
      console.log("txHash", transactionDetails.receipt.transactionHash);
      setIsSessionActive(true)
      toast.success(`Success! Session created succesfully`, {
        position: "top-right",
        autoClose: 18000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } catch(err) {
      console.error(err)
    }
  }
  return (
    <div>
    <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="dark"
    />

    

    {isSessionKeyModuleEnabled ? (
    <button onClick={() => createSession(false)} >Create Session</button>
    ) : (
      <button onClick={() => createSession(true)} >Enable and Create Session</button>
    )}
    {/* {isSessionActive && <ERC20Transfer smartAccount={smartAccount} provider={provider} address={address} />} */}
  </div>
    
  )
}

export default CreateSession;