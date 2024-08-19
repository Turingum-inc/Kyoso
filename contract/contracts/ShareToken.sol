// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ShareToken is ERC20 {
    constructor() ERC20("ShareToken", "ST") {
      _mint(msg.sender, 10000_000_000_000_000_000_000);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}
