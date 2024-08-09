import { expect } from "chai";
import { ethers } from "hardhat";
import { PortfolioFactory, Portfolio } from "../typechain";

// yarn run test test/PortfolioFactory.test.ts

describe("PortfolioFactory", function () {
  let portfolioFactory: PortfolioFactory;
  let curator: string;
  let kyoso: string;
  let tokenAddresses: string[];
  let ratios: number[];

  beforeEach(async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();
    curator = addr1.address;
    kyoso = addr2.address;
    tokenAddresses = [
      "0x0000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000002",
      "0x0000000000000000000000000000000000000003",
      "0x0000000000000000000000000000000000000004",
      "0x0000000000000000000000000000000000000005"
    ];
    ratios = [20, 20, 20, 20, 20];

    const PortfolioFactory = await ethers.getContractFactory("PortfolioFactory");
    portfolioFactory = await PortfolioFactory.deploy() as PortfolioFactory;
    console.log('portfolioFactory.target', portfolioFactory.target);
  });

  it("should create a new portfolio", async function () {
    const tx = await portfolioFactory.createPortfolio(
      "Test Portfolio",
      "TPF",
      curator,
      kyoso,
      tokenAddresses,
      ratios
    );
    await tx.wait();

    const allPortfolios = await portfolioFactory.getAllPortfolios();
    expect(allPortfolios.length).to.equal(1);
    expect(allPortfolios[0].name).to.equal("Test Portfolio");
    expect(allPortfolios[0].symbol).to.equal("TPF");
    expect(allPortfolios[0].curator).to.equal(curator);
  });

  it("should get portfolios for a curator", async function () {
    const tx = await portfolioFactory.createPortfolio(
      "Test Portfolio",
      "TPF",
      curator,
      kyoso,
      tokenAddresses,
      ratios
    );
    await tx.wait();

    const curatorPortfolios = await portfolioFactory.getPortfolioAddressByCurator(curator);
    expect(curatorPortfolios.length).to.equal(1);
  });
});
