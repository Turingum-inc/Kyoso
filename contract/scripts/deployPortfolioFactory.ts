const { ethers } = require("hardhat");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// npx hardhat run scripts/deployPortfolioFactory.ts --network base-sepolia
// npx hardhat verify --network base-sepolia 0x83b23Fc8B2D004Dc613c845b8242783B3B3efa0B
// https://sepolia.etherscan.io/address/0xCA9310e085cD711dff293a73681A9d8d00e6A22c
// https://sepolia.basescan.org/address/0x83b23Fc8B2D004Dc613c845b8242783B3B3efa0B

async function main() {
  const PortfolioFactoryFactory = await ethers.getContractFactory("PortfolioFactory");
  const portfolioFactory = await PortfolioFactoryFactory.deploy();

  console.log("PortfolioFactory deployed to:", `https://sepolia.basescan.org/address/${portfolioFactory.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});