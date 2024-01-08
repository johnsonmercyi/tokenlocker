const TokenLockerFactory = artifacts.require("TokenLockerFactory");

module.exports = function (deployer) {
  deployer.deploy(TokenLockerFactory);
};