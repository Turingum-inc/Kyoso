const { ethers } = require("hardhat");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// TODO: npx hardhat run scripts/deployChainlinkPriceFeedBaseSepolia.ts --network sepolia
// npx hardhat verify --network sepolia 0x6603dC573f454Cd20A9Ab9200863c672B8920fCb
// https://sepolia.etherscan.io/address/0x6603dC573f454Cd20A9Ab9200863c672B8920fCb

// TODO: Sepolia Deploy, Faucet取得

async function main() {
  const ChainlinkPriceFeedBaseSepolia = await ethers.getContractFactory("ChainlinkPriceFeedBaseSepolia");
  const chainlinkPriceFeedBaseSepolia = await ChainlinkPriceFeedBaseSepolia.deploy();

  console.log("chainlinkPriceFeedBaseSepolia deployed to:", `https://sepolia.etherscan.io/address/${chainlinkPriceFeedBaseSepolia.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});