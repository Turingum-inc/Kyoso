// get data from uniswap??
// base sepolia testnet
export const baseSepoliaContractAddressList = [
  "0x7CbA4cDEdaa8FB17Be58945109Fe2ff08FB0f4C6",
  "0x7CbA4cDEdaa8FB17Be58945109Fe2ff08FB0f4C6",
  "0x7CbA4cDEdaa8FB17Be58945109Fe2ff08FB0f4C6",
  "0x7CbA4cDEdaa8FB17Be58945109Fe2ff08FB0f4C6",
  "0x7CbA4cDEdaa8FB17Be58945109Fe2ff08FB0f4C6",
];

// https://tokenlist.arbitrum.io/ArbTokenLists/arbed_arb_whitelist_era.json
export const getCoinImages = (): { [key: string]: string } => {
  return {
    BTC: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
    DAI: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
    LINK: "https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png",
    USDC: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    USDT: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
  };
};
