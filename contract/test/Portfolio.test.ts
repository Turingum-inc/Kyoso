import { expect } from "chai";
import { ethers } from "hardhat";
import { Portfolio } from "../typechain-types";


describe("Portfolio Contract", function () {
  let portfolio: Portfolio;
  let portfolioToken: any
  let owner: any, curator: any, kyoso: any, buyer: any;
  let tokenAddresses: string[], ratios: number[];

  before(async function () {
    [owner, curator, kyoso, buyer] = await ethers.getSigners();

    // Define token addresses and ratios for the portfolio
    // get info from uniswap
    tokenAddresses = [
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002",
      "0x0000000000000000000000000000000000000003",
      "0x0000000000000000000000000000000000000004",
      "0x0000000000000000000000000000000000000005"
    ];
    ratios = [20, 20, 20, 20, 20];

    // Create a new portfolio
    const PortfolioFactory = await ethers.getContractFactory("Portfolio");
    portfolio = await PortfolioFactory.connect(owner).deploy(
      "Test Portfolio",
      "TPF",
      curator,
      kyoso,
      // 'aaa',
      tokenAddresses,
      ratios
    )
  });

  it("should retrieve portfolio information", async function () {
    // Retrieve portfolio information
    const name = await portfolio.name();
    const symbol = await portfolio.symbol();
    const curatorAddress = await portfolio.curator();
    const kyosoAddress = await portfolio.kyoso();
    const tokenList = await portfolio.getTokenAddresses();
    const ratioList = await portfolio.getRatios();

    // Assertions to check the portfolio information
    expect(name).to.equal("Test Portfolio");
    expect(symbol).to.equal("TPF");
    expect(curatorAddress).to.equal(curator.address);
    expect(kyosoAddress).to.equal(kyoso.address);
    expect(tokenList).to.deep.equal(tokenAddresses);
    expect(ratioList.map((r: BigInt) => Number(r))).to.deep.equal(ratios);
  });


  describe("Should allow a user to buy a portfolio", function () {
    it("should allow a user to buy a portfolio", async function () {
      const amount = ethers.parseEther("1.0"); // 1 ETH
      const tx = await portfolio.connect(buyer).buyPortfolio(amount, { value: amount })
      console.log('tx', tx);
    })

    it("should correctly distribute ETH to curator and kyoso", async function () {
      const amount = ethers.parseEther("1.0"); // 1 ETH in wei
  
      // Initial balances
      const initialCuratorBalanceBigInt = BigInt((await ethers.provider.getBalance(curator.address)).toString());
      const initialKyosoBalanceBigInt = BigInt((await ethers.provider.getBalance(kyoso.address)).toString());
  
      // Buy portfolio
      await portfolio.connect(buyer).buyPortfolio(amount, { value: amount });
  
      // Calculate expected shares
      const amountInWei = BigInt(ethers.parseEther("1.0").toString());
      const curatorShare = amountInWei * BigInt(1) / BigInt(100); // 1% of ETH
      const kyosoShare = amountInWei * BigInt(5) / BigInt(1000); // 0.5% of ETH
  
      // Fetch final balances
      const finalCuratorBalanceBigInt = BigInt((await ethers.provider.getBalance(curator.address)).toString());
      const finalKyosoBalanceBigInt = BigInt((await ethers.provider.getBalance(kyoso.address)).toString());
  
      // Calculate changes in balance
      const curatorBalanceChange = finalCuratorBalanceBigInt - initialCuratorBalanceBigInt;
      const kyosoBalanceChange = finalKyosoBalanceBigInt - initialKyosoBalanceBigInt;
  
      // Assertions
      expect(ethers.formatEther(curatorBalanceChange).toString()).to.equal(ethers.formatEther(curatorShare).toString());
      expect(ethers.formatEther(kyosoBalanceChange).toString()).to.equal(ethers.formatEther(kyosoShare).toString());
  
      const amountEth = ethers.formatEther(amount).toString()
      const curatorBalanceEth = ethers.formatEther(curatorBalanceChange).toString()
      const kyosoBalanceEth = ethers.formatEther(kyosoBalanceChange).toString()
  
      console.log('amountEth', amountEth);
      console.log('curatorBalanceEth', curatorBalanceEth);
      console.log('kyosoBalanceEth', kyosoBalanceEth);
    })

    it("should add msg.sender to buyerList and emit PortfolioBought event", async function () {
      const amount = ethers.parseEther("1.0"); // 1 ETH

      // Call buyPortfolio function as buyer
      const tx = await portfolio.connect(buyer).buyPortfolio(amount, { value: amount });
      await tx.wait();

      // Check if msg.sender (buyer) is added to buyerList
      const buyerList = await portfolio.getBuyerList();
      expect(buyerList).to.include(buyer.address);

      // Check if PortfolioBought event is emitted correctly
      await expect(tx)
          .to.emit(portfolio, "PortfolioBought")
          .withArgs(buyer.address, portfolio.target, amount);
    });

    it("should swap ETH for tokens", async function () {
      const amountIn = ethers.parseEther("1"); // 1 ETH

      // Mock Uniswap Router
      await mockUniswapRouter.setReturnAmounts([amountIn]);

      await expect(() =>
          portfolio._swapETHForTokenTest(mockERC20.address, amountIn, { value: amountIn })
      ).to.changeEtherBalance(portfolio, -amountIn);

      // Check the token balance of the contract
      const tokenBalance = await mockERC20.balanceOf(portfolio.address);
      expect(tokenBalance).to.be.gt(0); // Ensure the contract received tokens
  });
});

});
