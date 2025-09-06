// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BadgeNFT is ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    mapping(uint256 => string) public badgeTypeLabel;
    string private baseTokenURI;

    event BadgeMinted(address indexed to, uint256 tokenId, uint256 badgeType);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        // Assign deployer as default admin, admin, and minter
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function setBaseURI(string calldata uri) external onlyRole(ADMIN_ROLE) {
        baseTokenURI = uri;
    }

    function setBadgeTypeLabel(uint256 badgeType, string calldata label) external onlyRole(ADMIN_ROLE) {
        badgeTypeLabel[badgeType] = label;
    }

    function mintBadge(address to, uint256 badgeType) public onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tid = _tokenIdCounter.current();
        _safeMint(to, tid);
        emit BadgeMinted(to, tid, badgeType);
        return tid;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function batchMint(address[] calldata tos, uint256[] calldata badgeTypes) external onlyRole(MINTER_ROLE) {
        require(tos.length == badgeTypes.length, "len mismatch");
        for (uint i = 0; i < tos.length; ++i) {
            mintBadge(tos[i], badgeTypes[i]);
        }
    }

    // 🔹 Fix multiple inheritance: override supportsInterface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
