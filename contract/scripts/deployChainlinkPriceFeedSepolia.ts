const { ethers } = require("hardhat");
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// npx hardhat run scripts/deployChainlinkPriceFeedSepolia.ts --network sepolia
// npx hardhat verify ---contract "contracts/ChainlinkPriceFeedSepolia.sol:ChainlinkPriceFeedSepolia" --network sepolia 0x7bB12dC71d75223479062f9336B38D9369eD3751
// https://sepolia.etherscan.io/address/0x7bB12dC71d75223479062f9336B38D9369eD3751#readContract

async function main() {
  const ChainlinkPriceFeedSepolia = await ethers.getContractFactory("ChainlinkPriceFeedSepolia");
  const chainlinkPriceFeedSepolia = await ChainlinkPriceFeedSepolia.deploy();

  console.log("chainlinkPriceOracle deployed to:", `https://sepolia.etherscan.io/address/${chainlinkPriceFeedSepolia.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});