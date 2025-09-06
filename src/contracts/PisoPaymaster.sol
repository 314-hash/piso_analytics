// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PisoPaymaster is AccessControl, ReentrancyGuard {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    IERC20 public immutable piso;
    uint256 public feeBps = 50;
    address public treasury;

    mapping(address => uint256) public deposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RelayerPaid(address indexed relayer, uint256 amount, uint256 fee);
    event FeeParamsUpdated(uint256 feeBps, address treasury);

    constructor(IERC20 piso_, address admin, address treasury_) {
        piso = piso_;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGER_ROLE, admin);
        treasury = treasury_;
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        deposits[msg.sender] += amount;
        require(piso.transferFrom(msg.sender, address(this), amount), "transfer failed");
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        uint256 bal = deposits[msg.sender];
        require(bal >= amount, "insufficient deposit");
        deposits[msg.sender] = bal - amount;
        require(piso.transfer(msg.sender, amount), "transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function setFeeParams(uint256 _feeBps, address _treasury) external onlyRole(MANAGER_ROLE) {
        require(_feeBps <= 1000, "fee too high");
        feeBps = _feeBps;
        treasury = _treasury;
        emit FeeParamsUpdated(_feeBps, _treasury);
    }

    function payRelayer(address relayer, uint256 amount) external nonReentrant {
        require(amount > 0, "zero");
        uint256 bal = deposits[msg.sender];
        require(bal >= amount, "insufficient deposit");
        deposits[msg.sender] = bal - amount;
        _payRelayer(relayer, amount);
    }

    function _payRelayer(address relayer, uint256 amount) internal {
        uint256 fee = _calcFee(amount);
        uint256 net = amount - fee;
        require(piso.transfer(relayer, net), "pay relayer failed");
        if (fee > 0 && treasury != address(0)) {
            require(piso.transfer(treasury, fee), "pay treasury failed");
        }
        emit RelayerPaid(relayer, amount, fee);
    }

    function _calcFee(uint256 amount) internal view returns (uint256) {
        return (amount * feeBps) / 10000;
    }

    function sweepToken(IERC20 token, address to, uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(token.transfer(to, amount), "transfer failed");
    }
}
