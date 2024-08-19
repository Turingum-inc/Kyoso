// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Portfolio} from "./Portfolio.sol";
import {IPortfolioFactory} from "./interface/IPortfolioFactory.sol";

contract PortfolioFactory is IPortfolioFactory {
    PortfolioInfo[] public portfolios;
    mapping(address => address[]) public userPortfolios;

    /**
     * @dev Create a new instance of Portfolio contract.
     * @param _name The name of the ERC20 contract.
     * @param _symbol The symbol of the ERC20 contract.
     * @param _curator The portfolio creator.
     * @param _kyoso The operator of the site where the portfolio is posted.
     * @param _tokenAddresses The contract addresses of the ERC20 tokens selected for the portfolio.
     * @param _ratios The ratios of the ERC20 tokens selected for the portfolio.
     */

    //  * @param _uniswapRouter The address of the Uniswap V2 Router.
    function createPortfolio(
        string memory _name,
        string memory _symbol,
        address _curator,
        address _kyoso,
        // address _uniswapRouter,
        address[] memory _tokenAddresses,
        uint256[] memory _ratios
    ) public returns (address) {
        require(_tokenAddresses.length == _ratios.length, "Token addresses and ratios length mismatch");
        uint256 totalRatio = 0;
        for (uint256 i = 0; i < _ratios.length; i++) {
            totalRatio += _ratios[i];
        }
        require(totalRatio == 100, "Total ratios must equal 100");

        Portfolio newPortfolio = new Portfolio(
            _name,
            _symbol,
            _curator,
            _kyoso,
            // _uniswapRouter,
            _tokenAddresses,
            _ratios
        );

        PortfolioInfo memory newPortfolioInfo = PortfolioInfo({
            portfolioAddress: address(newPortfolio),
            curator: _curator,
            name: _name,
            symbol: _symbol,
            tokenAddresses: _tokenAddresses,
            ratios: _ratios
        });

        portfolios.push(newPortfolioInfo);
        userPortfolios[_curator].push(address(newPortfolio));

        emit FactoryCreated(
            address(newPortfolio),
            _curator,
            _name,
            _symbol,
            _tokenAddresses,
            _ratios
        );

        return address(newPortfolio);
    }

    function getAllPortfolios() public view returns (PortfolioInfo[] memory) {
        return portfolios;
    }

    function getPortfolioAddressByCurator(address _curator) public view returns (address[] memory) {
        return userPortfolios[_curator];
    }
}
