// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {

  const [owner] = await ethers.getSigners();
  console.log("Owner: ", owner.address);
  console.log("Owner balance:", (await owner.getBalance()).toString());

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NFT = await ethers.getContractFactory("PIXELBOTS");
  const name = "PIXELBOTS";
  const symbol = "PIXELBOTS";
  const initBaseURI = "https://assets.iotabots.io/";

  const nft = await NFT.deploy(name, symbol, initBaseURI);
  await nft.deployed();

  console.log("NFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
