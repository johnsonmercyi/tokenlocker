const TokenLockerFactory = artifacts.require("TokenLockerFactory");
const IERC20 = artifacts.require("IERC20");
const TokenLocker = artifacts.require("TokenLocker");

contract("TokenLockerFactory", async (accounts) => {
  // console.log("TokenLockerFactory: ", TokenLockerFactory);
  let factory;
  let tokenLocker;
  let manager = accounts[0];
  const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

  // SFTC Token on ganache Testnet
  // const tokenAddress = "0x1435C8B4c72615D4073b57423A87bf0d21F815ef";
  const tokenAddress = "0xCebD093EdDfF9E8be5741FC52225385314de25Fd";

  beforeEach(async () => {
    factory = await TokenLockerFactory.new();
  });

  it("should confirm that TokenLockerFactory was deployed", async () => {
    assert.notEqual(
      factory.address,
      DEFAULT_ADDRESS,
      "Factory was not deployed"
    );
  });

  it("should deploy TokenLocker using factory", async () => { 

    // Create a new TokenLocker using the factory
    const reciept = await factory.createTokenLocker(
      manager, 'Escrow', { 
        from: manager 
    });

    // Get created TokenLocker addresses from factory
    const tokenLockerAddress = await factory.getDeployedTokenLocker(manager);
    // console.log("TOKEN LOCKER: ", tokenLockerAddress);

    // Retrieve the deployed TokenLocker address from the emitted event or logs
    const event = reciept.logs.find(log => log.event === 'TokenLockerCreated');
    const eventTokenLockerAddress = event.args.tokenLocker;

    // // // Access the deployed TokenLocker contract
    const tokenLockerInstance = await TokenLocker.at(eventTokenLockerAddress);

    assert.notEqual(
      tokenLockerInstance.address,
      DEFAULT_ADDRESS,
      "TokenLocker was not deployed"
    );

    assert.equal(
      tokenLockerInstance.address,
      tokenLockerAddress,
      "TokenLocker addresses don't matched!"
    );
  });

  it("should not allow one manager to create multiple Token Lockers", async () => {
    // Create a new TokenLocker using the factory
    try {
      const reciept1 = await factory.createTokenLocker(
        manager, 'Escrow', {
        from: manager
      });

      // Create a new TokenLocker using the factory
      const reciept2 = await factory.createTokenLocker(
        manager, 'Escrow', {
        from: manager
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("should approve tokenLocker and spend for user", async () => {

    const amountToDeposit = web3.utils.toBN('20000000000000000000'); // Example: 1 token in wei
    const tokenInstance = await IERC20.at(tokenAddress);

    // Create a new TokenLocker using the factory
    await factory.createTokenLocker(manager, 'Escrow', {
      from: manager
    });

    // Get created TokenLocker address for this manager from factory
    const tokenLockerAddress = await factory.getDeployedTokenLocker(manager);

    // Approve tokenLocker to spend specified amount of token
    await tokenInstance.approve(tokenLockerAddress, amountToDeposit, { from: manager });

    // Access the deployed TokenLocker contract
    const tokenLockerInstance = await TokenLocker.at(tokenLockerAddress);

    // Fectch the approved allowance for this contract to spend
    const allowance = await tokenLockerInstance.checkAllowance(tokenAddress, {from: manager});

    // Deposit and return reciept
    const reciept = await tokenLockerInstance.deposit(
      tokenAddress,
      accounts[1],
      allowance,
      3600,
      "Staking - John Doe",
      { from: manager }
    );

    // Fetch the emitted event and arguments
    const event = reciept.logs.find(log => log.event === 'TokensDeposited');
    const { depositor, beneficiary, amount, title } = event.args;

    const lockedTokens = await tokenLockerInstance.getLockedTokens();
    const lockedToken = lockedTokens[0];
    console.log();

    assert.equal(tokenAddress, lockedToken.token, "Token addresses don't match");
    assert.equal(accounts[1], lockedToken.beneficiary, "Beneficiary addresses don't match");
    assert.equal(allowance.toString(), lockedToken.amount.toString(), "Amount to deposit don't match");

  });
});
