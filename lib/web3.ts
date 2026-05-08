import { createPublicClient, http, parseAbi, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'),
});

export const INTENT_VAULT_ADDRESS = (
  process.env.NEXT_PUBLIC_INTENT_VAULT_ADDRESS || '0x0000000000000000000000000000000000000000'
) as Address;

export const INTENT_VAULT_ABI = parseAbi([
  'function registerIntent(bytes32 intentHash, string calldata ipfsCid) external returns (uint256)',
  'function executeIntent(uint256 intentId, bytes calldata executionData) external',
  'function cancelIntent(uint256 intentId) external',
  'function getIntent(uint256 intentId) external view returns (address owner, bytes32 intentHash, string ipfsCid, uint8 status, uint256 createdAt, uint256 executionCount)',
  'function getUserIntentIds(address user) external view returns (uint256[] memory)',
  'event IntentRegistered(uint256 indexed intentId, address indexed owner, bytes32 intentHash)',
  'event IntentExecuted(uint256 indexed intentId, bytes executionData)',
  'event IntentCancelled(uint256 indexed intentId)',
]);

export function hashIntent(intentData: string): `0x${string}` {
  const encoder = new TextEncoder();
  const data = encoder.encode(intentData);
  // Simple keccak-like hash for demo — in production use viem's keccak256
  let hash = 0n;
  for (const byte of data) {
    hash = (hash * 31n + BigInt(byte)) % (2n ** 256n);
  }
  return ('0x' + hash.toString(16).padStart(64, '0')) as `0x${string}`;
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function getBaseScanUrl(txHash: string): string {
  return `https://sepolia.basescan.org/tx/${txHash}`;
}
