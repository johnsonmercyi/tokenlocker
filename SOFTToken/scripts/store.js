const SOFTToken = artifacts.require('SOFTToken');

module.exports = async (callback) => {
  try {
    const sOFTToken = await SOFTToken.deployed();
    // const reciept = await helloBlockchain.SendRequest("Hello World");
    // console.log(reciept);

  } catch(err) {
    console.log('Oops: ', err.message);
  }
  callback();
};
