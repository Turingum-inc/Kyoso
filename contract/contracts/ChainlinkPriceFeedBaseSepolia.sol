// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Importing the Chainlink AggregatorV3Interface
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract ChainlinkPriceFeedSepolia {
    // Mapping to store price feed contracts by their name
    mapping(string => AggregatorV3Interface) internal priceFeeds;
    mapping(string => uint8) internal priceDecimals;

    constructor() {
        // BaseSepolia testnet addresses and decimals
        priceFeeds["BTC/USD"] = AggregatorV3Interface(0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298);
        priceDecimals["BTC/USD"] = 8;

        priceFeeds["CBETH/USD"] = AggregatorV3Interface(0x3c65e28D357a37589e1C7C86044a9f44dDC17134);
        priceDecimals["CBETH/USD"] = 8;

        priceFeeds["DAI/USD"] = AggregatorV3Interface(0xD1092a65338d049DB68D7Be6bD89d17a0929945e);
        priceDecimals["DAI/USD"] = 8;

        priceFeeds["ETH/USD"] = AggregatorV3Interface(0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1);
        priceDecimals["ETH/USD"] = 8;

        priceFeeds["LINK/ETH"] = AggregatorV3Interface(0x56a43EB56Da12C0dc1D972ACb089c06a5dEF8e69);
        priceDecimals["LINK/ETH"] = 18;

        priceFeeds["LINK/USD"] = AggregatorV3Interface(0xb113F5A928BCfF189C998ab20d753a47F9dE5A61);
        priceDecimals["LINK/USD"] = 8;

        priceFeeds["USDC/USD"] = AggregatorV3Interface(0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165);
        priceDecimals["USDC/USD"] = 8;

        priceFeeds["USDT/USD"] = AggregatorV3Interface(0x3ec8593F930EA45ea58c968260e6e9FF53FC934f);
        priceDecimals["USDT/USD"] = 8;
    }

    /**
     * @dev Returns the latest price for a given pair.
     * @param pair The pair identifier, e.g., "BTC/USD".
     */
    function getLatestPrice(string memory pair) public view returns (int256) {
        AggregatorV3Interface priceFeed = priceFeeds[pair];
        uint8 decimals = priceDecimals[pair];
        (
            ,
            int256 price,
            ,
            ,
        ) = priceFeed.latestRoundData();

        return price / int256(10 ** decimals);
    }
}
