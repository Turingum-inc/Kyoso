import { type ClassValue, clsx } from "clsx"
import { BigNumber } from "ethers";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string[]): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const convertHexToNumber = (hex: string): number => {
  return BigNumber.from(hex).toNumber();
};