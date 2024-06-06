import { ethers, hardhatArguments } from "hardhat";

async function main() {
  const Escrow = await ethers.getContractFactory("Escrow");
  const EscrowFactory = await ethers.getContractFactory("EscrowFactory");

  const escrow = await Escrow.deploy();
  const factory = await EscrowFactory.deploy(escrow.address);

  await escrow.deployed();
  await factory.deployed();

  console.log(`Contracts deployed:`);
  console.log(`Factory: ${factory.address}`);
  console.log(`Escrow: ${escrow.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
