/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/DOlPdtMozJ2
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from "@/components/ui/chart";
import { Pie, PieChart, CartesianGrid, XAxis, Line, LineChart } from "recharts";
import PortfolioFactory from "../contracts/PortfolioFactory.sol/PortfolioFactory.json";
import Portfolio from "../contracts/Portfolio.sol/Portfolio.json";
import { ethers } from "ethers";
import { FACTORY_CONTRACT_ADDRESS } from "@/lib/constants";
import { convertHexToNumber } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Portfolio {
  ids: string[][];
  tokens: string[][];
  ratios: number[][];
}
interface KyosoProps {
  account: string;
  signer: ethers.Signer | null;
}

export function Kyoso({ account, signer }: KyosoProps) {
  const [portfolioData, setPortfolioData] = useState<Portfolio[]>([]);
  const [isCurateModalOpen, setCurateModalOpen] = useState(false);
  const [isCuratePendingModalOpen, setCuratePendingModalOpen] = useState(false);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isPurchasePendingModalOpen, setPurchasePendingModalOpen] =
    useState(false);
  const getAllPortfolios = async () => {
    try {
      const contract = new ethers.Contract(
        FACTORY_CONTRACT_ADDRESS as string,
        PortfolioFactory.abi,
        signer as any
      );
      if (!contract) {
        console.error("Contract is not initialized");
        return;
      }

      const result = await contract?.getAllPortfolios();

      const portfolios = result.map((item: any) => {
        const portfolioIdArray = item[0];
        const tokenAddressArray = item[4];
        const numberArray = item[5].map((num: any) =>
          convertHexToNumber(num._hex)
        );

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

  useEffect(() => {
    getAllPortfolios();
  }, [account, isCuratePendingModalOpen, isPurchasePendingModalOpen]);

  return (
    <div className="flex justify-between p-6 ml-36">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Performance</h2>
          <p className="text-muted-foreground">Last 7 days</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-purple-100 p-6">
            <div className="flex justify-between items-start">
              <Button variant="default" className="bg-blue-500 text-white">
                Buy
              </Button>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>@ariyasu</span>
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <PiechartlabelChart className="w-40 h-40" />
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">評価損益</p>
                <p className="text-2xl font-bold text-green-500">↑ 15.09%</p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="text-left space-y-1">
                <p>UNI</p>
                <p>USDC</p>
                <p>Bento</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500">20%</p>
                <p className="text-green-500">20%</p>
                <p className="text-green-500">15%</p>
              </div>
              <div className="text-right space-y-1">
                <p>ETH</p>
                <p>HIGHER</p>
                <p className="text-green-500">15%</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500">30%</p>
                <p className="text-green-500">15%</p>
              </div>
            </div>
          </Card>
          <Card className="bg-purple-100 p-6">
            <div className="flex justify-between items-start">
              <Button variant="default" className="bg-blue-500 text-white">
                Buy
              </Button>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>@shuding</span>
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <PiechartlabelChart className="w-40 h-40" />
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">評価損益</p>
                <p className="text-2xl font-bold text-green-500">↑ 12.34%</p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="text-left space-y-1">
                <p>BTC</p>
                <p>ETH</p>
                <p>LINK</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500">25%</p>
                <p className="text-green-500">20%</p>
                <p className="text-green-500">15%</p>
              </div>
              <div className="text-right space-y-1">
                <p>AAVE</p>
                <p>COMP</p>
                <p className="text-green-500">10%</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500">25%</p>
                <p className="text-green-500">5%</p>
              </div>
            </div>
          </Card>
          <Card className="bg-purple-100 p-6">
            <div className="flex justify-between items-start">
              <Button variant="default" className="bg-blue-500 text-white">
                Buy
              </Button>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>@maxleiter</span>
              </div>
            </div>
            <div className="flex flex-col items-center mt-4">
              <PiechartlabelChart className="w-40 h-40" />
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">評価損益</p>
                <p className="text-2xl font-bold text-green-500">↑ 8.76%</p>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div className="text-left space-y-1">
                <p>SOL</p>
                <p>MATIC</p>
                <p>AVAX</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500">30%</p>
                <p className="text-green-500">20%</p>
                <p className="text-green-500">15%</p>
              </div>
              <div className="text-right space-y-1">
                <p>LUNA</p>
                <p>ATOM</p>
                <p className="text-green-500">10%</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-green-500">20%</p>
                <p className="text-green-500">5%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LinechartChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="desktop"
            type="natural"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

function PiechartlabelChart(props: any) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          visitors: {
            label: "Visitors",
          },
          chrome: {
            label: "Chrome",
            color: "hsl(var(--chart-1))",
          },
          safari: {
            label: "Safari",
            color: "hsl(var(--chart-2))",
          },
          firefox: {
            label: "Firefox",
            color: "hsl(var(--chart-3))",
          },
          edge: {
            label: "Edge",
            color: "hsl(var(--chart-4))",
          },
          other: {
            label: "Other",
            color: "hsl(var(--chart-5))",
          },
        }}
        className="mx-auto aspect-square max-h-[250px] pb-0"
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={[
              { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
              { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
              {
                browser: "firefox",
                visitors: 187,
                fill: "var(--color-firefox)",
              },
              { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
              { browser: "other", visitors: 90, fill: "var(--color-other)" },
            ]}
            dataKey="visitors"
            label
            nameKey="browser"
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
