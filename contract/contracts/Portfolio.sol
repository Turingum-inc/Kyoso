// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Using OpenZeppelin IERC20
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {IPortfolio} from "./interface/IPortfolio.sol";

interface IUniswapV2Router {
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);
}

contract Portfolio is ReentrancyGuard, IPortfolio {
    PortfolioData internal portfolioData; // If a struct contains a mapping, that struct cannot be directly declared as a public state variable.
    mapping(address => bool) public isBuyer;
    
    uint256 public curatorFee = 1; // 1% as a fee
    uint256 public kyosoFee = 5;  // 0.5% as a fee
    string public name;
    string public symbol;
    address public curator;
    address public kyoso;

    IUniswapV2Router02 public uniswapRouter;
    address[] path;

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
        // TODO: Complete the process of swapping remainAmount according to the ratios of the tokens.
        // _swapETHForTokens(remainAmount);

        if (!isBuyer[msg.sender]) {
            portfolioData.buyerList.push(msg.sender);
            isBuyer[msg.sender] = true;
        }
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

    function _swapETHForTokens(uint256 ethAmount) internal {
        uint256 totalRatio = 0;
        for (uint256 i = 0; i < portfolioData.ratios.length; i++) {
            totalRatio += portfolioData.ratios[i];
        }

        for (uint256 i = 0; i < portfolioData.tokenAddresses.length; i++) {
            uint256 tokenAmount = (ethAmount * portfolioData.ratios[i]) / totalRatio;
            uint256 swappedAmount = _swapETHForToken(portfolioData.tokenAddresses[i], tokenAmount);
            _sendErc20(msg.sender, swappedAmount);
        }
    }

    function _swapETHForToken(address tokenAddress, uint256 ethAmount) internal returns (uint256) {
        path[0] = uniswapRouter.WETH();
        path[1] = tokenAddress;

        uint[] memory amounts = uniswapRouter.swapExactETHForTokens{ value: ethAmount }(
            0, // Accept any amount of tokens
            path,
            address(this),
            block.timestamp
        );
        return amounts[1];
    }

    function _sendErc20(address to, uint256 amount) internal {
        IERC20 token = IERC20(to); // Explicitly specify which IERC20 to use
        token.transfer(to, amount);
        emit DistributionSent(to, amount);
    }

    /**
     * @dev Create a new instance of Portfolio contract.
     * @param tokenAddress The address of the ERC20 contract.
     * @param ethAmount The amount of swap Ether
     */
    // https://zenn.dev/heku/books/bb6dd5fe02feb7/viewer/4d4b5a
    function _swapETHForTokenTest(address tokenAddress, uint256 ethAmount) internal returns (uint256) {
        path[0] = uniswapRouter.WETH();
        path[1] = tokenAddress;

        uint256 deadline = block.timestamp + 15; // 15 seconds deadline

        uint[] memory amounts = uniswapRouter.swapExactETHForTokens{ value: ethAmount }(
            0, // Accept any amount of tokens
            path,
            address(this), // The contract or msg.sendor()
            deadline
        );

        return amounts[1];
    }


    // To receive ETH when `swapExactETHForTokens` is called
    receive() external payable {}    
}
