// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IntentVault
 * @author IntentFlow
 * @notice On-chain registry for AI-parsed DeFi intents.
 *         Each intent is stored as a keccak256 hash of its structured JSON,
 *         linked to an IPFS CID for full data availability.
 *
 * Deployed on: Base Sepolia Testnet
 */
contract IntentVault {
    // ── Types ────────────────────────────────────────────────────────────────

    enum IntentStatus {
        Active,     // 0 — live, waiting for execution
        Executed,   // 1 — successfully executed
        Cancelled,  // 2 — cancelled by owner
        Failed      // 3 — execution failed
    }

    struct Intent {
        address owner;
        bytes32 intentHash;   // keccak256 of the structured intent JSON
        string  ipfsCid;      // IPFS CID pointing to full intent data
        IntentStatus status;
        uint256 createdAt;
        uint256 updatedAt;
        uint256 executionCount;
    }

    // ── State ─────────────────────────────────────────────────────────────────

    uint256 public nextIntentId = 1;
    mapping(uint256 => Intent) public intents;
    mapping(address => uint256[]) public userIntents;

    // Authorized executors (e.g. Chainlink Automation nodes or IntentFlow backend)
    mapping(address => bool) public authorizedExecutors;
    address public owner;

    // ── Events ────────────────────────────────────────────────────────────────

    event IntentRegistered(
        uint256 indexed intentId,
        address indexed owner,
        bytes32 intentHash,
        string ipfsCid
    );

    event IntentExecuted(
        uint256 indexed intentId,
        bytes executionData,
        uint256 executionCount
    );

    event IntentCancelled(uint256 indexed intentId, address indexed by);

    event IntentFailed(uint256 indexed intentId, string reason);

    event ExecutorUpdated(address indexed executor, bool authorized);

    // ── Modifiers ─────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "IntentVault: not owner");
        _;
    }

    modifier onlyIntentOwner(uint256 intentId) {
        require(intents[intentId].owner == msg.sender, "IntentVault: not intent owner");
        _;
    }

    modifier onlyExecutor() {
        require(
            authorizedExecutors[msg.sender] || msg.sender == owner,
            "IntentVault: not authorized executor"
        );
        _;
    }

    modifier intentExists(uint256 intentId) {
        require(intentId > 0 && intentId < nextIntentId, "IntentVault: intent does not exist");
        _;
    }

    // ── Constructor ───────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        authorizedExecutors[msg.sender] = true;
    }

    // ── Core functions ────────────────────────────────────────────────────────

    /**
     * @notice Register a new intent on-chain.
     * @param intentHash  keccak256 hash of the structured intent JSON
     * @param ipfsCid     IPFS CID for full intent data
     * @return intentId   The ID assigned to this intent
     */
    function registerIntent(
        bytes32 intentHash,
        string calldata ipfsCid
    ) external returns (uint256 intentId) {
        require(intentHash != bytes32(0), "IntentVault: empty hash");
        require(bytes(ipfsCid).length > 0, "IntentVault: empty CID");

        intentId = nextIntentId++;

        intents[intentId] = Intent({
            owner: msg.sender,
            intentHash: intentHash,
            ipfsCid: ipfsCid,
            status: IntentStatus.Active,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            executionCount: 0
        });

        userIntents[msg.sender].push(intentId);

        emit IntentRegistered(intentId, msg.sender, intentHash, ipfsCid);
    }

    /**
     * @notice Mark an intent as executed. Only callable by authorized executors.
     * @param intentId       The intent to mark as executed
     * @param executionData  ABI-encoded execution details (tx hash, amounts, etc.)
     */
    function executeIntent(
        uint256 intentId,
        bytes calldata executionData
    ) external onlyExecutor intentExists(intentId) {
        Intent storage intent = intents[intentId];
        require(intent.status == IntentStatus.Active, "IntentVault: intent not active");

        intent.executionCount++;
        intent.updatedAt = block.timestamp;

        // For one-time intents, mark as executed; recurring stays Active
        // (caller passes 0x01 as last byte to signal completion)
        if (executionData.length > 0 && executionData[executionData.length - 1] == 0x01) {
            intent.status = IntentStatus.Executed;
        }

        emit IntentExecuted(intentId, executionData, intent.executionCount);
    }

    /**
     * @notice Cancel an intent. Only the intent owner can cancel.
     */
    function cancelIntent(uint256 intentId)
        external
        intentExists(intentId)
        onlyIntentOwner(intentId)
    {
        Intent storage intent = intents[intentId];
        require(intent.status == IntentStatus.Active, "IntentVault: intent not active");

        intent.status = IntentStatus.Cancelled;
        intent.updatedAt = block.timestamp;

        emit IntentCancelled(intentId, msg.sender);
    }

    /**
     * @notice Mark an intent as failed. Only authorized executors.
     */
    function markFailed(uint256 intentId, string calldata reason)
        external
        onlyExecutor
        intentExists(intentId)
    {
        Intent storage intent = intents[intentId];
        require(intent.status == IntentStatus.Active, "IntentVault: intent not active");

        intent.status = IntentStatus.Failed;
        intent.updatedAt = block.timestamp;

        emit IntentFailed(intentId, reason);
    }

    // ── View functions ────────────────────────────────────────────────────────

    function getIntent(uint256 intentId)
        external
        view
        intentExists(intentId)
        returns (
            address intentOwner,
            bytes32 intentHash,
            string memory ipfsCid,
            uint8 status,
            uint256 createdAt,
            uint256 executionCount
        )
    {
        Intent storage i = intents[intentId];
        return (i.owner, i.intentHash, i.ipfsCid, uint8(i.status), i.createdAt, i.executionCount);
    }

    function getUserIntentIds(address user) external view returns (uint256[] memory) {
        return userIntents[user];
    }

    function getTotalIntents() external view returns (uint256) {
        return nextIntentId - 1;
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    function setExecutor(address executor, bool authorized) external onlyOwner {
        authorizedExecutors[executor] = authorized;
        emit ExecutorUpdated(executor, authorized);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "IntentVault: zero address");
        owner = newOwner;
    }
}
