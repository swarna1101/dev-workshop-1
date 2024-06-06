import { Address, chain } from "wagmi";

export const contracts = {
  [chain.mainnet.id]: {
    EscrowFactory: { address: "0xe69cfd3dE53BFAdAA6081813E9eAa118c768A547" },
  },
};
export type ContractType = keyof typeof contracts[1];

export const tokens: { label: string; value: Address }[] = [
  { label: "TestToken", value: "0xA49A6dc55AA51fBCA85ee637f1DBC3AC68060336" },
];
