// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GuardianRecoveryWallet is ReentrancyGuard {
    address public owner;
    mapping(address => bool) public isGuardian;
    address[] public guardiansList;
    uint256 public guardianThreshold;

    struct Recovery {
        address proposedOwner;
        uint256 approvals;
        uint256 createdAt;
        bool executed;
        mapping(address => bool) approvedBy;
    }
    mapping(uint256 => Recovery) private recoveries;
    uint256 public recoveryNonce;

    event Executed(address indexed target, uint256 value, bytes data, bytes result);
    event RecoveryProposed(uint256 indexed id, address proposer, address proposedOwner);
    event RecoveryApproved(uint256 indexed id, address guardian, uint256 approvals);
    event RecoveryExecuted(uint256 indexed id, address newOwner);
    event RecoveryCancelled(uint256 indexed id);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    modifier onlyGuardian() {
        require(isGuardian[msg.sender], "only guardian");
        _;
    }

    constructor(address initialOwner, address[] memory initialGuardians, uint256 threshold) {
        require(initialOwner != address(0), "zero owner");
        require(initialGuardians.length >= threshold && threshold > 0, "invalid threshold");
        owner = initialOwner;
        guardianThreshold = threshold;
        for (uint i = 0; i < initialGuardians.length; ++i) {
            address g = initialGuardians[i];
            require(g != address(0), "zero guardian");
            if (!isGuardian[g]) {
                isGuardian[g] = true;
                guardiansList.push(g);
            }
        }
    }

    function execute(address target, uint256 value, bytes calldata data) external payable nonReentrant returns (bytes memory) {
        require(msg.sender == owner, "not owner");
        (bool ok, bytes memory res) = target.call{value: value}(data);
        require(ok, "call failed");
        emit Executed(target, value, data, res);
        return res;
    }

    receive() external payable {}
    fallback() external payable {}

    function addGuardian(address g) external onlyOwner {
        require(g != address(0), "zero");
        if (!isGuardian[g]) {
            isGuardian[g] = true;
            guardiansList.push(g);
        }
    }

    function removeGuardian(address g) external onlyOwner {
        require(isGuardian[g], "not guardian");
        isGuardian[g] = false;
        for (uint i = 0; i < guardiansList.length; ++i) {
            if (guardiansList[i] == g) {
                guardiansList[i] = guardiansList[guardiansList.length - 1];
                guardiansList.pop();
                break;
            }
        }
        if (guardianThreshold > guardiansList.length) {
            guardianThreshold = guardiansList.length;
        }
    }

    function setThreshold(uint256 t) external onlyOwner {
        require(t > 0 && t <= guardiansList.length, "invalid threshold");
        guardianThreshold = t;
    }

    function proposeRecovery(address proposedOwner) external onlyGuardian returns (uint256) {
        require(proposedOwner != address(0), "zero");
        uint256 id = ++recoveryNonce;
        Recovery storage r = recoveries[id];
        r.proposedOwner = proposedOwner;
        r.approvals = 0;
        r.createdAt = block.timestamp;
        r.executed = false;
        r.approvedBy[msg.sender] = true;
        r.approvals = 1;
        emit RecoveryProposed(id, msg.sender, proposedOwner);
        emit RecoveryApproved(id, msg.sender, 1);
        return id;
    }

    function approveRecovery(uint256 id) external onlyGuardian {
        Recovery storage r = recoveries[id];
        require(r.proposedOwner != address(0), "invalid id");
        require(!r.executed, "already executed");
        require(!r.approvedBy[msg.sender], "already approved");
        r.approvedBy[msg.sender] = true;
        r.approvals += 1;
        emit RecoveryApproved(id, msg.sender, r.approvals);
    }

    function executeRecovery(uint256 id) external onlyGuardian {
        Recovery storage r = recoveries[id];
        require(r.proposedOwner != address(0), "invalid id");
        require(!r.executed, "already executed");
        require(r.approvals >= guardianThreshold, "insufficient approvals");
        owner = r.proposedOwner;
        r.executed = true;
        emit RecoveryExecuted(id, owner);
    }

    function cancelRecovery(uint256 id) external onlyOwner {
        Recovery storage r = recoveries[id];
        require(r.proposedOwner != address(0), "invalid id");
        require(!r.executed, "already executed");
        r.executed = true;
        emit RecoveryCancelled(id);
    }

    function getGuardians() external view returns (address[] memory) {
        return guardiansList;
    }

    function getRecoveryApprovals(uint256 id) external view returns (uint256) {
        return recoveries[id].approvals;
    }
}
