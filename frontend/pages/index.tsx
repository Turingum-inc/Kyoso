import React from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Footer } from "@/components/footer";
import { Kyoso } from "@/components/kyoso";
import Header from "@/components/header";

export default function Home() {
  const { account, signer, connectWallet, disConnectWallet } = useWallet();

  return (
    <>
      <Header
        account={account}
        signer={signer}
        connectWallet={connectWallet}
        disConnectWallet={disConnectWallet}
      />
      <Kyoso account={account} signer={signer} />
      <Footer />
    </>
  );
}
