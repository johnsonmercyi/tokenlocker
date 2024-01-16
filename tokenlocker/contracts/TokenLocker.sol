// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenLockerFactory {
    // address[] public deployedTokenLoackers;
    mapping(address => TokenLocker) public deployedTokenLockers;
    mapping(address => bool) public hasCreatorATokenLocker;
 
    // Event declaration for TokenLocker creation
    event TokenLockerCreated(
        address indexed tokenLocker,
        address indexed creator,
        string lockerName
    );

    // Function to create a new TokenLocker contract
    function createTokenLocker(address creator, string memory name) external {
        require(
            !hasCreatorATokenLocker[creator],
            "This manager has a token locker already! Please consider locking more tokens your token locker."
        );
        // Deploy a new instance of TokenLocker contract
        TokenLocker newTokenLocker = new TokenLocker(creator, name);
        deployedTokenLockers[creator] = newTokenLocker;

        hasCreatorATokenLocker[creator] = true; // Same manager shouldn't create another Token locker

        // Emit an event to log the creation of a new TokenLocker contract
        emit TokenLockerCreated(address(newTokenLocker), creator, name);
    }

    function getDeployedTokenLocker(
        address creator
    ) public view returns (address) {
        return address(deployedTokenLockers[creator]);
    }
}

contract TokenLocker {
    struct LockedToken {
        IERC20 token;
        address payable beneficiary;
        uint256 amount;
        uint256 lockdownDate;
        uint256 lockdownPeriod;
        string title;
        bool isReleased;
    }

    address public manager;
    string public lockerName;
    LockedToken[] public lockedTokens;

    event TokensDeposited(
        address indexed depositor,
        address indexed beneficiary,
        uint256 amount,
        string title
    );

    event TokensReleased(
        address indexed depositor,
        address indexed beneficiary,
        uint256 amount,
        string title,
        uint period,
        uint lockdownDate
    );

    event TokenTransferApproved(
        bool isApproved,
        address spender,
        uint256 amount
    );

    modifier restricted() {
        require(msg.sender == manager, "The manager is not making this call");
        _;
    }

    constructor(address creator, string memory name) {
        manager = creator;
        lockerName = name;
    }

    // This doesn't show allowance after approval ???
    function checkAllowance(
        address tokenAddress
    ) public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.allowance(address(msg.sender), address(this));
    }

    // This works well
    function checkBalance(
        address tokenAddress,
        address account
    ) public view returns (uint256) {
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
        uint allowance = token.allowance(address(msg.sender), address(this));
        require(allowance >= amount, "Token allowance too low");

        // Check user balance
        uint userBalance = token.balanceOf(address(msg.sender));
        require(userBalance >= amount, "Insufficient balance");

        // Transfer tokens after approval and balance checks
        require(
            token.transferFrom(address(msg.sender), address(this), amount),
            "Token transaction failed!"
        ); // Tries to deposit

        // If deposit is successful...

        // Lock down the tokens
        lockedTokens.push(
            LockedToken({
                token: token,
                beneficiary: beneficiary,
                amount: amount,
                lockdownDate: block.timestamp,
                lockdownPeriod: lockdownPeriod,
                title: title,
                isReleased: false
            })
        );

        emit TokensDeposited(msg.sender, beneficiary, amount, title); // Emit event
    }

    function release(uint index) public restricted {
        LockedToken storage lockedToken = lockedTokens[index];

        require(
            block.timestamp >= lockedToken.lockdownPeriod,
            "Release time has not arrived yet!"
        );

        // uint256 amount = lockedToken.token.balanceOf(address(this));
        // uint256 amount = lockedToken.token.balanceOf(address(this));
    require(lockedToken.amount > 0, "No tokens to release!");
        lockedToken.token.transfer(lockedToken.beneficiary, lockedToken.amount);

        // Update the status of the locked token
        lockedToken.isReleased = true;

        emit TokensReleased(
            msg.sender,
            lockedToken.beneficiary,
            lockedToken.amount,
            lockedToken.title,
            lockedToken.lockdownPeriod,
            lockedToken.lockdownDate
        );
    }

    function getLockedTokens() public view returns (LockedToken[] memory) {
        return lockedTokens;
    }
}
