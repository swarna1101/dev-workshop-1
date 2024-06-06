import { useNetwork } from "wagmi";

import { contracts, ContractType } from "config";

export function useContractConfig(contract: ContractType) {
  const { chain } = useNetwork();

  if (!chain?.id) return { address: "" };

  const id = chain.id as keyof typeof contracts;

  if (contracts[id] === undefined) {
    return { address: "0xe69cfd3dE53BFAdAA6081813E9eAa118c768A547" }
  }

  return contracts[id][contract] || { address: "" };
}
