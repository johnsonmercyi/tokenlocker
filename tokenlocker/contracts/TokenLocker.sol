// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
// interface IERC20 {
//     /**
//      * @dev Emitted when `value` tokens are moved from one account (`from`) to
//      * another (`to`).
//      *
//      * Note that `value` may be zero.
//      */
//     event Transfer(address indexed from, address indexed to, uint256 value);

//     /**
//      * @dev Emitted when the allowance of a `spender` for an `owner` is set by
//      * a call to {approve}. `value` is the new allowance.
//      */
//     event Approval(address indexed owner, address indexed spender, uint256 value);

//     /**
//      * @dev Returns the value of tokens in existence.
//      */
//     function totalSupply() external view returns (uint256);

//     /**
//      * @dev Returns the value of tokens owned by `account`.
//      */
//     function balanceOf(address account) external view returns (uint256);

//     /**
//      * @dev Moves a `value` amount of tokens from the caller's account to `to`.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event.
//      */
//     function transfer(address to, uint256 value) external returns (bool);

//     /**
//      * @dev Returns the remaining number of tokens that `spender` will be
//      * allowed to spend on behalf of `owner` through {transferFrom}. This is
//      * zero by default.
//      *
//      * This value changes when {approve} or {transferFrom} are called.
//      */
//     function allowance(address owner, address spender) external view returns (uint256);

   
//     function approve(address spender, uint256 value) external returns (bool);

//     /**
//      * @dev Moves a `value` amount of tokens from `from` to `to` using the
//      * allowance mechanism. `value` is then deducted from the caller's
//      * allowance.
//      *
//      * Returns a boolean value indicating whether the operation succeeded.
//      *
//      * Emits a {Transfer} event.
//      */
//     function transferFrom(address from, address to, uint256 value) external returns (bool);
// }


contract TokenLockerFactory {

    // address[] public deployedTokenLoackers;
    mapping(address => address[]) public deployedTokenLockers;

    // Event declaration for TokenLocker creation
    event TokenLockerCreated(address indexed tokenLocker, address indexed creator, string lockerName);

    // Function to create a new TokenLocker contract
    function createTokenLocker(
        address creator,
        string memory name
    ) external {
        // Deploy a new instance of TokenLocker contract
        address newTokenLocker = address(new TokenLocker(creator, name));
        deployedTokenLockers[creator].push(newTokenLocker);
        
        // Emit an event to log the creation of a new TokenLocker contract
        emit TokenLockerCreated(newTokenLocker, creator, name);
    }

    function getDeployedTokenLockers(address creator) public view returns(address [] memory) {
        return deployedTokenLockers[creator];
    }
}

contract TokenLocker {
    struct LockedToken {
        IERC20 token;
        address payable beneficiary;
        uint256 amount;
        uint256 lockdownPeriod;
        string title;
        bool isReleased;
    }

    address public manager;
    mapping(address => bool) public managerTokenLockerCheck;
    string public lockerName;
    mapping(uint256 => LockedToken) public lockedTokens;
    uint public totalLockedTokens;

    event TokensDeposited(
      address indexed depositor, 
      address indexed beneficiary, 
      uint256 amount, 
      string title
    );

    event TokensReleased(
      address indexed depositor, 
      address indexed beneficiary, 
      uint256 amount, string title, 
      uint period
    );

    event TokenTransferApproved(
      bool isApproved, 
      address spender, 
      uint256 amount
    );

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(address creator, string memory name) {
        require(!managerTokenLockerCheck[creator], "This manager has a token locker already!");
        manager = creator;
        lockerName = name;
        managerTokenLockerCheck[manager] = true; // Same manager shouldn't create another Token locker 
    }

    // This doesn't show allowance after approval ???
    function checkAllowance(address tokenAddress) public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.allowance(address(msg.sender), address(this));
    }

    // This works well
    function checkBalance(address tokenAddress, address account) public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(account);
    }


    function deposit(
        address tokenAddress,
        address payable beneficiary, 
        uint amount,
        uint lockdownPeriod,
        string memory title
    ) public restricted {
        require(amount > 0, "Invalid amount!");

        IERC20 token = IERC20(tokenAddress);

        // Check allowance first
        uint allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Token allowance too low");

        // Check user balance
        uint userBalance = token.balanceOf(msg.sender);
        require(userBalance >= amount, "Insufficient balance");

        // Transfer tokens after approval and balance checks
        require(token.transferFrom(msg.sender, address(this), amount), "Token transaction failed!");// Tries to deposit

        // If deposit is successful...

        // Lock down the tokens
        lockedTokens[totalLockedTokens] = LockedToken({
            token: token,
            beneficiary: beneficiary,
            amount: amount,
            lockdownPeriod: lockdownPeriod,
            title: title,
            isReleased: false
        });

        totalLockedTokens ++;

        emit TokensDeposited(msg.sender, beneficiary, amount, title); // Emit event
    }


    function release(uint index) public restricted {
        LockedToken storage lockedToken = lockedTokens[index];

        require(block.timestamp >= lockedToken.lockdownPeriod, "Release time has not arrived yet!");
        uint256 amount = lockedToken.token.balanceOf(address(this));
        require(amount > 0, "No tokens to release");
        lockedToken.token.transfer(lockedToken.beneficiary, amount);

        // Delete the released token entry and update the totalLockedTokens count
        lockedTokens[index].isReleased = true;

        emit TokensReleased(msg.sender, lockedToken.beneficiary, amount, lockedToken.title, lockedToken.lockdownPeriod);
    }
}

