// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IPortfolioFactory {
  struct PortfolioInfo {
      address portfolioAddress;
      address curator;
      string name;
      string symbol;
      address[] tokenAddresses;
      uint256[] ratios;
  }
  event FactoryCreated(
      address indexed portfolioAddress,
      address indexed curator,
      string name,
      string symbol,
      address[] tokenAddresses,
      uint256[] ratios
  );
}