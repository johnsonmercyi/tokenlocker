const TokenLockerFactory = artifacts.require("TokenLockerFactory");
const IERC20 = artifacts.require("IERC20");
const TokenLocker = artifacts.require("TokenLocker");

contract("TokenLockerFactory", async (accounts) => {
  // console.log("TokenLockerFactory: ", TokenLockerFactory);
  let factory;
  let tokenLocker;
  let manager = accounts[0];
  const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

  // WEENUS Token on Sepolia Testnet
  const tokenAddress = "0x1435C8B4c72615D4073b57423A87bf0d21F815ef";

  beforeEach(async () => {
    // Deploys contracts internally
    factory = await TokenLockerFactory.deployed();

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
    const addresses = await factory.getDeployedTokenLockers(manager);
    console.log("ADDRESS: ", addresses);

    // Retrieve the deployed TokenLocker address from the emitted event or logs
    const event = reciept.logs.find(log => log.event === 'TokenLockerCreated');
    const newTokenLockerAddress = event.args.tokenLocker;

    // // Access the deployed TokenLocker contract
    const tokenLockerInstance = await TokenLocker.at(newTokenLockerAddress);
    const address = [...addresses].find(add => add === newTokenLockerAddress);

    assert.notEqual(
      tokenLockerInstance.address,
      DEFAULT_ADDRESS,
      "TokenLocker was not deployed"
    );

    assert.equal(
      tokenLockerInstance.address,
      address,
      "TokenLocker addresses don't matched!"
    );
  });

  it("should approve tokenLocker to deposit", async () => {

    const amount = web3.utils.toBN('20000000000000000000'); // Example: 1 token in wei
    // const tokenInstance = new web3.eth.Contract(IERC20, tokenAddress);
    const tokenInstance = await IERC20.at(tokenAddress);
    // console.log("TOKEN: ", tokenInstance);

    // Deploys contracts internally

    // // Create a new TokenLocker using the factory
    await factory.createTokenLocker(manager, 'Escrow', {
      from: manager
    });

    // // Get created TokenLocker addresses from factory
    const addresses = await factory.getDeployedTokenLockers(manager);

    await tokenInstance.approve(addresses[0], amount, { from: manager });

    // // Access the deployed TokenLocker contract
    const tokenLockerInstance = await TokenLocker.at(addresses[0]);
    const allowance = await tokenLockerInstance.checkAllowance(tokenAddress, {from: manager});

    console.log("ALLOWANCE: ", allowance.toString());
  });
});
