// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1#sepolia-testnet

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
        // Sepolia testnet addresses and decimals
        priceFeeds["ARKB Reserves"] = AggregatorV3Interface(0x2605811a8Bc3971b321cDe1fE8FCd280F632875E);
        priceDecimals["ARKB Reserves"] = 8;

        priceFeeds["AUD/USD"] = AggregatorV3Interface(0xB0C712f98daE15264c8E26132BCC91C40aD4d5F9);
        priceDecimals["AUD/USD"] = 8;

        priceFeeds["BTC/ETH"] = AggregatorV3Interface(0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22);
        priceDecimals["BTC/ETH"] = 18;

        priceFeeds["BTC/USD"] = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
        priceDecimals["BTC/USD"] = 8;

        priceFeeds["CSPX/USD"] = AggregatorV3Interface(0x4b531A318B0e44B549F3b2f824721b3D0d51930A);
        priceDecimals["CSPX/USD"] = 8;

        priceFeeds["CZK/USD"] = AggregatorV3Interface(0xC32f0A9D70A34B9E7377C10FDAd88512596f61EA);
        priceDecimals["CZK/USD"] = 8;

        priceFeeds["DAI/USD"] = AggregatorV3Interface(0x14866185B1962B63C3Ea9E03Bc1da838bab34C19);
        priceDecimals["DAI/USD"] = 8;

        priceFeeds["ETH/USD"] = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        priceDecimals["ETH/USD"] = 8;

        priceFeeds["EUR/USD"] = AggregatorV3Interface(0x1a81afB8146aeFfCFc5E50e8479e826E7D55b910);
        priceDecimals["EUR/USD"] = 8;
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
