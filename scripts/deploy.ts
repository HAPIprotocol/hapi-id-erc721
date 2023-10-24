import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  let adminAddress;
  if (process.env.ADMIN_ADDRESS) {
    adminAddress = process.env.ADMIN_ADDRESS;
  } else {
    adminAddress = await deployer.getAddress();
  }

  let minterAddress;
  if (process.env.MINTER_ADDRESS) {
    minterAddress = process.env.MINTER_ADDRESS;
  } else {
    minterAddress = await deployer.getAddress();
  }

  const HAPIID = await ethers.getContractFactory("HAPIID");
  const hapiid = await HAPIID.deploy(adminAddress, minterAddress);

  await hapiid.waitForDeployment();

  const contractAddress = await hapiid.getAddress();

  console.log(
    `HAPI ID deployed to ${contractAddress} with admin ${adminAddress} and minter ${minterAddress}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
