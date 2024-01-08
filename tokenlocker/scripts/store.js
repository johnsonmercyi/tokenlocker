const TokenLockerFactory = artifacts.require('TokenLockerFactory');

module.exports = async (callback) => {
  try {
    const tokenLockerFactory = await TokenLockerFactory.deployed();
    const reciept = await tokenLockerFactory.getDeployedTokenLockers("Hello World");
    console.log(reciept);

  } catch(err) {
    console.log('Oops: ', err.message);
  }
  callback();
};
