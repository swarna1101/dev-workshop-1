import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const WALLET_PRIVATE_KEY = "YOUR_PRIVATE_KEY";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: { optimizer: { enabled: true, runs: 1000 } },
  },
  networks: {
    changi: {
      url: "https://dmc.mydefichain.com/changi",
      chainId: 1133,
      accounts: [WALLET_PRIVATE_KEY as string]
    }
  }
};

export default config;
