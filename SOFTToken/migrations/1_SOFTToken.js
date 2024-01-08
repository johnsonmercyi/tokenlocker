const SOFTToken = artifacts.require("SOFTToken");

module.exports = function (deployer) {
  deployer.deploy(SOFTToken);
};