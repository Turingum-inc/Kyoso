// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IPortfolio {
  struct PortfolioData {
      address[] tokenAddresses;
      uint256[] ratios;
      address[] buyerList;
  }
  event PortfolioCreated(address indexed curator, string name, string symbol);
  event PortfolioBought(address indexed buyer, address indexed portfolio, uint256 amount);
  event PortfolioSold(address indexed seller, address indexed token, uint256 ethAmount);
  event DistributionSent(address indexed to, uint256 amount);
  event BuyerRemoved(address indexed buyer);
}