// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";


contract PISO is ERC20, ERC20Permit {
uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18; // 100 million tokens


constructor(address admin)
ERC20("PISO", "PISO")
ERC20Permit("PISO")
{
_mint(admin, MAX_SUPPLY);
}
}