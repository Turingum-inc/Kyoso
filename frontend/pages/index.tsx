import { useEffect, useState } from "react";
import { baseSepoliaContractAddressList } from "@/utils/data";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ethers, BigNumber } from "ethers";
import Portfolio from "../contracts/Portfolio.json";
import PortfolioFactory from "../contracts/PortfolioFactory.json";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Portfolio {
  ids: string[][];
  tokens: string[][];
  ratios: number[][];
}

export default function Home() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState();
  const [selectedTokens, setSelectedTokens] = useState(
    Array(5).fill({ token: "", ratio: "" })
  );
  const [isCurateModalOpen, setCurateModalOpen] = useState(false);
  const [isCuratePendingModalOpen, setCuratePendingModalOpen] = useState(false);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isPurchasePendingModalOpen, setPurchasePendingModalOpen] =
    useState(false);
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);
  const [ethAmount, setEthAmount] = useState("");
  const [selectedPortfolio, setSelectedPortfolio] = useState(portfolioData[0]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.error("MetaMask not installed");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const web3Provider = new ethers.providers.Web3Provider(ethereum);
      const signer = web3Provider.getSigner();
      setSigner(signer as any);
    } catch (err) {
      console.log(err);
    }
  };

  const disConnectWallet = async () => {
    try {
      setAccount("");
      setContract(null);
    } catch (err) {
      console.log(err);
    }
  };

  const openCurateModal = () => {
    setCurateModalOpen(true);
  };

  const closeCurateModal = () => {
    setCurateModalOpen(false);
  };

  const handleTokenChange = (e, index) => {
    const newTokens = [...selectedTokens];
    newTokens[index] = {
      ...newTokens[index],
      token: e.target.value,
    };
    setSelectedTokens(newTokens);
  };

  const handleRatioChange = (e, index) => {
    const newRatios = [...selectedTokens];
    newRatios[index] = {
      ...newRatios[index],
      ratio: e.target.value,
    };
    setSelectedTokens(newRatios);
  };

  const organizeTokensAndRatios = (selectedTokens) => {
    const tokens = selectedTokens.map((item) => item.token);
    const ratios = selectedTokens.map((item) => parseFloat(item.ratio)); // parseFloatを使って数値に変換
    const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);
    if (totalRatio !== 100) {
      alert("Ratios must add up to 100.");
      throw new Error("Ratios must add up to 100.");
    }

    return { tokens, ratios };
  };

  const convertHexToNumber = (hex: string): number => {
    return BigNumber.from(hex).toNumber();
  };

  const curatePortfolio = async (selectedTokens) => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS as string,
      PortfolioFactory.abi,
      signer
    );
    if (!contract) {
      console.error("Contract with MetaMask is not initialized");
      return;
    }

    try {
      const { tokens, ratios } = organizeTokensAndRatios(selectedTokens);

      const contractTx = await contract.createPortfolio(
        process.env.NEXT_PUBLIC_PF_NAME as string,
        process.env.NEXT_PUBLIC_PF_SYMBOL as string,
        account, // curator
        process.env.NEXT_PUBLIC_KYOSO_ADDRESS as string, // _kyoso
        tokens,
        ratios
      );

      try {
        const res = await contractTx.wait();
        if (res.transactionHash) {
          setCuratePendingModalOpen(false);
        }
      } catch (error) {
        console.log("error", error);
        setCuratePendingModalOpen(false);
      }
    } catch (err) {
      console.log(err);
      setCuratePendingModalOpen(false);
    }
  };

  const getAllPortfolios = async () => {
    try {
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS as string,
        PortfolioFactory.abi,
        signer
      );
      if (!contract) {
        console.error("Contract with MetaMask is not initialized");
        return;
      }

      const result = await contract?.getAllPortfolios();

      const portfolios = result.map((item) => {
        const portfolioIdArray = item[0];
        const tokenAddressArray = item[4];
        const numberArray = item[5].map((num) => convertHexToNumber(num._hex));

        return {
          ids: [portfolioIdArray],
          tokens: [tokenAddressArray],
          ratios: [numberArray],
        };
      });
      setPortfolioData(portfolios);
    } catch (err) {
      console.log(err);
    }
  };

  const openBuyModal = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setPurchaseModalOpen(true);
  };

  const closeBuyModal = () => {
    setPurchaseModalOpen(false);
  };

  const handleEthAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty value or valid number
    if (value === "" || !isNaN(parseFloat(value))) {
      setEthAmount(value);
    }
  };

  const handleBlur = (e) => {
    let value = e.target.value;
    // Handle case where the input starts with a dot
    if (value.startsWith(".")) {
      value = "0" + value;
    }
    // Format the value to 4 decimal places
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setEthAmount(parsedValue.toFixed(4));
    }
  };

  const calculateTokenEthValue = (ratio) => {
    return (ethAmount * ratio) / 100;
  };

  const buyPortfolio = async (selectedPortfolio) => {
    try {
      const contractPortfolio = new ethers.Contract(
        selectedPortfolio.ids[0],
        Portfolio.abi,
        signer
      );
      if (!contractPortfolio) {
        console.error("ContractPortfolio with MetaMask is not initialized");
        return;
      }
      // TODO: buyPortfolioで分配される
      // Convert ethAmount to BigNumber (in wei)
      const weiAmount = ethers.utils.parseUnits(ethAmount.toString(), "ether");
      const decimalValue = BigInt(weiAmount._hex.toString()).toString();
      console.log("weiAmount (Decimal):", decimalValue);

      const tx = {
        gasLimit: 1000000, // Set a reasonable gas limit
        value: weiAmount, // Specify the amount in wei
      };

      const contractTx = await contractPortfolio?.buyPortfolio(
        Number(decimalValue),
        tx
      );

      // const sendRequests = decimalValue;

      // const requestParams = {
      //   type: 2,
      //   from: contractTx.from,
      //   chainId: "11155111", // 0xaa36a7
      // };

      // // estimate Gas
      // const estimatedGas = await contractPortfolio?.buyPortfolio.estimateGas(
      //   selectedPortfolio.ids[0],
      //   sendRequests,
      //   requestParams
      // );

      // console.log("estimatedGas", estimatedGas);

      try {
        const res = await contractTx.wait();
        if (res.transactionHash) {
          setPurchasePendingModalOpen(false);
        }
      } catch (error) {
        console.log("error", error);
        setPurchasePendingModalOpen(false);
      }
    } catch (err) {
      console.log(err);
      setPurchasePendingModalOpen(false);
    }
  };

  useEffect(() => {
    getAllPortfolios();
  }, [account]);

  return (
    <div className="flex flex-col items-center bg-slate-100 min-h-screen">
      <div className="flex mt-1">
        <div>
          <div className="flex items-center my-8">
            <h2 className="text-3xl font-bold">Kyoso</h2>
            <button
              className="ml-24 bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:bg-blue-400 hover:cursor-pointer"
              onClick={openCurateModal}
              disabled={!account}
            >
              Curate Portfolio
            </button>
            {account ? (
              <button
                className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:text-white hover:bg-blue-500 hover:cursor-pointer"
                onClick={disConnectWallet}
              >
                Logout
              </button>
            ) : (
              <button
                className="bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:text-white hover:bg-blue-500 hover:cursor-pointer"
                onClick={connectWallet}
              >
                Connect to MetaMask
              </button>
            )}
          </div>

          <p className="py-4"></p>

          {portfolioData.length > 0 && (
            <div className="w-full max-w-2xl">
              {portfolioData.map((portfolio, index) => {
                const chartData = {
                  labels: portfolio.tokens[0] || [],
                  datasets: [
                    {
                      label: `Token Ratios - Portfolio ${index + 1}`,
                      data: portfolio.ratios[0] || [],
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                };

                return (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Portfolio {index + 1}
                    </h3>
                    <button
                      className="bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:text-white hover:bg-blue-400 hover:cursor-pointer"
                      onClick={() => openBuyModal(portfolio)}
                    >
                      Buy
                    </button>
                    <Chart type="pie" data={chartData} />
                  </div>
                );
              })}
            </div>
          )}

          <p className="py-4"></p>

          {isCurateModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Curate Portfolio</h2>

                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Token {index + 1}
                    </label>
                    <select
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onChange={(e) => handleTokenChange(e, index)}
                      value={selectedTokens[index]?.token || ""}
                    >
                      <option value="" disabled>
                        Select token
                      </option>
                      {/* // TODO: 銘柄の表示 */}
                      {baseSepoliaContractAddressList.map((address) => (
                        <option key={address} value={address}>
                          {address}
                        </option>
                      ))}
                    </select>
                    <label className="block text-sm font-medium text-gray-700 mt-2">
                      Ratio {index + 1}
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={selectedTokens[index]?.ratio || ""}
                      onChange={(e) => handleRatioChange(e, index)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={closeCurateModal}
                    className="bg-gray-500 text-white font-semibold py-2 px-4 border border-gray-600 rounded hover:bg-gray-600 hover:border-transparent"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      curatePortfolio(selectedTokens);
                      setCurateModalOpen(false);
                      setCuratePendingModalOpen(true);
                    }}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-600 rounded hover:bg-blue-600 hover:border-transparent"
                  >
                    Curate
                  </button>
                </div>
              </div>
            </div>
          )}

          {isPurchaseModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl  text-black  font-semibold mb-4">
                  Purchase Portfolio
                </h2>

                <div className="bg-blue-100 p-4 rounded-md">
                  <div className="mb-4 flex">
                    <input
                      type="number"
                      value={ethAmount}
                      onChange={handleEthAmountChange}
                      onBlur={handleBlur}
                      step="any"
                      className="flex-2 mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="flex-1 ml-2 mt-3">ETH</p>
                  </div>

                  <div className="flex flex-col space-y-4">
                    {selectedPortfolio?.tokens[0].map((token, index) => (
                      <div key={token} className="flex items-center space-x-4">
                        <span className="block text-sm font-medium text-gray-700">
                          {token}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({selectedPortfolio.ratios[0][index]}%)
                        </span>
                        <p className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700">
                          {calculateTokenEthValue(
                            selectedPortfolio.ratios[0][index]
                          ).toFixed(4)}{" "}
                          ETH
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={closeBuyModal}
                      className="bg-gray-200 text-black py-2 px-4 border rounded hover:bg-gray-600 hover:border-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        buyPortfolio(selectedPortfolio);
                        setPurchaseModalOpen(false);
                        setPurchasePendingModalOpen(true);
                      }}
                      className="bg-blue-500 text-white font-semibold py-2 px-4 border border-blue-600 rounded hover:bg-blue-600 hover:border-transparent"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCuratePendingModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-xl font-semibold pb-8">
                  Creating the portfolio. Please wait a moment...
                </h2>
                <div className="flex justify-center items-center mb-4">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {isPurchasePendingModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-xl font-semibold pb-8">
                  Purchasing the portfolio. Please wait a moment...
                </h2>
                <div className="flex justify-center items-center mb-4">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
