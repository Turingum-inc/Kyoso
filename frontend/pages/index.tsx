import React from "react";
import { HeaderComponent } from "@/components/header-component";
import { FooterComponent } from "@/components/footer-component";
import { useWallet } from "@/contexts/WalletContext";
import { KyosoComponent } from "@/components/kyoso-component";

export default function Home() {
  const { account, signer, connectWallet, disConnectWallet } = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <KyosoComponent
        account={account}
        signer={signer}
        connectWallet={connectWallet}
        disConnectWallet={disConnectWallet}
      />
      <FooterComponent />
    </main>
  );
}
