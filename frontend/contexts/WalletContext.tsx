import React, { createContext, useState, useContext } from "react";
import { ethers } from "ethers";

interface WalletContextProps {
  account: string;
  signer: ethers.Signer | null;
  connectWallet: () => Promise<void>;
  disConnectWallet: () => void;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string>("");
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (ethereum?.request) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
      } else {
        console.error("MetaMask not installed");
      }

      const web3Provider = new ethers.providers.Web3Provider(ethereum);
      const signer = web3Provider.getSigner();
      setSigner(signer);
    } catch (err) {
      console.log(err);
    }
  };

  const disConnectWallet = () => {
    setAccount("");
    setSigner(null);
  };

  return (
    <WalletContext.Provider
      value={{ account, signer, connectWallet, disConnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
