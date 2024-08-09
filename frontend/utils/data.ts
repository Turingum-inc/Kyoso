// https://tokenlist.arbitrum.io/ArbTokenLists/arbed_arb_whitelist_era.json
export interface CoinInfo {
  symbol: string;
  contractAddress: string;
  imageUrl: string;
}

export const coinData: { [key: string]: CoinInfo } = {
  ETH: {
    symbol: "ETH",
    contractAddress: "0x96c20C62171977B0d598f9Fd6D52283c903433aA",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/2710.png"
  },
  WBTC: {
    symbol: "WBTC",
    contractAddress: "0xF1d9562D5d43b001cDCb32d16565C1aC05aa4AbE",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png"
  },
  DAI: {
    symbol: "DAI",
    contractAddress: "0x701f372f2A10688c4f3e31E20ceabC1f3A88ac2c",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png"
  },
  USDC: {
    symbol: "USDC",
    contractAddress: "0xE5d7a04E54d654997332Dd7553742b537A4179B8",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
  },
  AAVE: {
    symbol: "AAVE",
    contractAddress: "0x528B8Db610beE16A97863Bcaa9F13ce3a55D4415",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png"
  },
  USDT: {
    symbol: "USDT",
    contractAddress: "0x73b4a58138CCcBDa822dF9449FeDA5eaC6669ebD",
    imageUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"
  }
};
