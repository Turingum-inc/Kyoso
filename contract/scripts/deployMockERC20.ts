const { ethers } = require("hardhat");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// npx hardhat run scripts/deployMockERC20.ts --network sepolia
// npx hardhat verify --network sepolia 0x4e3D12ce8E237307C1D0C41c2d2ecf86d1381DB2

async function main() {
  const MockERC20Factory = await ethers.getContractFactory("MockERC20");
  const mockERC20 = await MockERC20Factory.deploy("TEST", "TT", "100000000");

  console.log("MockERC20Factory deployed to:", `https://sepolia.etherscan.io/address/${mockERC20.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});