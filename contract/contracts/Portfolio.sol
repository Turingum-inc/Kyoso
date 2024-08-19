// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IPortfolio} from "./interface/IPortfolio.sol";

contract Portfolio is ReentrancyGuard, IPortfolio {
    PortfolioData internal portfolioData;
    mapping(address => bool) public isBuyer;
    
    uint256 public curatorFee = 1; // 1% as a fee
    uint256 public kyosoFee = 5;  // 0.5% as a fee
    string public name;
    string public symbol;
    address public curator;
    address public kyoso;

    constructor(
        string memory _name,
        string memory _symbol,
        address _curator,
        address _kyoso,
        address[] memory _tokenAddresses,
        uint256[] memory _ratios
    ) {
        require(_tokenAddresses.length == _ratios.length, "Token addresses and ratios length mismatch");
        curator = _curator;
        kyoso = _kyoso;
        name = _name;
        symbol = _symbol;
        
        portfolioData.tokenAddresses = _tokenAddresses;
        portfolioData.ratios = _ratios;

        emit PortfolioCreated(_curator, _name, _symbol);
    }

    function getTokenAddresses() external view returns (address[] memory) {
        return portfolioData.tokenAddresses;
    }

    function getRatios() external view returns (uint256[] memory) {
        return portfolioData.ratios;
    }

    function getBuyerList() external view returns (address[] memory) {
        return portfolioData.buyerList;
    }

    function buyPortfolio(uint256 amount) external payable nonReentrant {
        require(msg.value == amount, "Incorrect ETH amount");

        (uint256 curatorShare, uint256 kyosoShare) = _calculateDistribution(amount);
        _sendDistribution(curator, curatorShare);
        _sendDistribution(kyoso, kyosoShare);

        uint256 remainAmount = amount - curatorShare - kyosoShare;

        if (!isBuyer[msg.sender]) {
            portfolioData.buyerList.push(msg.sender);
            isBuyer[msg.sender] = true;
        }

        // mint ERC20 token


        emit PortfolioBought(msg.sender, address(this), amount);
    }

    function _calculateDistribution(uint256 ethAmount) internal view returns (uint256 curatorShare, uint256 kyosoShare) {
        curatorShare = (ethAmount * curatorFee) / 100; // 1%
        kyosoShare = (ethAmount * kyosoFee) / 1000;  // 0.5%
    }

    function _sendDistribution(address to, uint256 amount) internal {
        payable(to).transfer(amount);
        emit DistributionSent(to, amount);
    }
}
