/**
 * IntentVault deployment script
 * Run: node contracts/deploy.js
 *
 * Requirements:
 *   npm install ethers dotenv
 *   Set DEPLOYER_PRIVATE_KEY in .env.local
 */

const { ethers } = require('ethers');
require('dotenv').config({ path: '.env.local' });

const ABI = [
  "constructor()",
  "function registerIntent(bytes32, string) external returns (uint256)",
  "function executeIntent(uint256, bytes) external",
  "function cancelIntent(uint256) external",
  "function getIntent(uint256) external view returns (address, bytes32, string, uint8, uint256, uint256)",
  "function getUserIntentIds(address) external view returns (uint256[])",
  "function getTotalIntents() external view returns (uint256)",
  "function setExecutor(address, bool) external",
];

// Bytecode — replace with actual compiled bytecode from solc/hardhat/foundry
const BYTECODE = "0x"; // TODO: compile IntentVault.sol and paste bytecode here

async function main() {
  const rpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    console.error('❌ DEPLOYER_PRIVATE_KEY not set in .env.local');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`🚀 Deploying IntentVault from: ${wallet.address}`);
  console.log(`📡 Network: Base Sepolia`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
    console.warn('⚠️  Low balance. Get Base Sepolia ETH from: https://faucet.quicknode.com/base/sepolia');
  }

  const factory = new ethers.ContractFactory(ABI, BYTECODE, wallet);
  const contract = await factory.deploy();

  console.log(`⏳ Waiting for deployment...`);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ IntentVault deployed at: ${address}`);
  console.log(`\n📋 Add to .env.local:`);
  console.log(`NEXT_PUBLIC_INTENT_VAULT_ADDRESS=${address}`);
  console.log(`\n🔍 View on BaseScan: https://sepolia.basescan.org/address/${address}`);
}

main().catch(console.error);
