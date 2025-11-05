require("dotenv/config");
require("@nomicfoundation/hardhat-viem");

const BASE_SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || "";
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
	solidity: "0.8.20",
	networks: {
		"base-sepolia": {
			url: BASE_SEPOLIA_RPC_URL,
			accounts: WALLET_PRIVATE_KEY ? [WALLET_PRIVATE_KEY] : [],
			chainId: 84532,
		},
	},
	etherscan: {
		apiKey: {
			"base-sepolia": BASESCAN_API_KEY,
		},
		customChains: [
			{
				network: "base-sepolia",
				chainId: 84532,
				urls: {
					apiURL: "https://api-sepolia.basescan.org/api",
					browserURL: "https://sepolia.basescan.org",
				},
			},
		],
	},
};

module.exports = config;


