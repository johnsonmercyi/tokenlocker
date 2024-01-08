// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SOFTToken is ERC20 {
    constructor() ERC20("SOFTToken", "SFTC") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}
