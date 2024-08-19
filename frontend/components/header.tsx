import { Button } from "./ui/button";
import { ethers } from "ethers";

/**
 * Header Component
 * @returns
 */

interface HeaderProps {
  account: string;
  signer: ethers.Signer | null;
  connectWallet: () => void;
  disConnectWallet: () => void;
}

export default function Header({
  account,
  signer,
  connectWallet,
  disConnectWallet,
}: HeaderProps) {
  return (
    <div className="flex w-full items-center justify-between px-8 py-2 shadow-md ">
      <div className="flex justify-between p-6">
        <h1 className="text-2xl font-bold">Kyoso</h1>
        <div className="space-y-6"></div>
      </div>
      <div className="space-x-4">
        <Button variant="default" className="bg-blue-500 text-white">
          Curate Portfolio
        </Button>
        {account ? (
          <Button
            onClick={disConnectWallet}
            className="bg-blue-500 text-white hover:text-accent"
          >
            Disconnect ({account.substring(0, 6)}...{account.slice(-4)})
          </Button>
        ) : (
          <Button
            onClick={connectWallet}
            className="bg-green-500 text-white hover:text-accent"
          >
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
}
