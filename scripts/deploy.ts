import hre from "hardhat";

async function main() {
  console.log("Deploying QuoteNFT...");
  const quoteNFT = await hre.viem.deployContract("QuoteNFT");
  console.log("QuoteNFT deployed at:", quoteNFT.address);
  await quoteNFT.waitForDeployment();

  // Transfer ownership to the requested address so only that wallet can withdraw
  const newOwner = "0x784Bfbdbda35B79EC5C81c91d605bb1e8327f5cF" as const;
  try {
    const currentOwner = await (quoteNFT as any).read.owner();
    if (String(currentOwner).toLowerCase() !== newOwner.toLowerCase()) {
      console.log("Transferring ownership to:", newOwner);
      await (quoteNFT as any).write.transferOwnership([newOwner]);
      console.log("Ownership transferred.");
    } else {
      console.log("Owner already set to:", newOwner);
    }
  } catch (e) {
    console.warn("Could not transfer ownership automatically. You can call transferOwnership(newOwner) manually.", e);
  }

  console.log("Deployment complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


