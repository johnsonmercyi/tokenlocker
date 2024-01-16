const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 1337
    },
    dashboard: {},
    inf_soft_goerli: {
      network_id: 5,
      gasPrice: 100000000000,
      provider: new HDWalletProvider(fs.readFileSync('c:\\Users\\SOFT\\SOFT_DEV\\WEB3-PROJECTS\\tokenlocker\\SOFTToken\\soft.env', 'utf-8'), "https://goerli.infura.io/v3/d2f9fee04cef4dfc930ae76c1ba9c42d")
    },
    inf_soft_sepolia: {
      network_id: 11155111,
      gasPrice: 100000000000,
      provider: new HDWalletProvider(fs.readFileSync('c:\\Users\\SOFT\\SOFT_DEV\\WEB3-PROJECTS\\tokenlocker\\tokenlocker\\soft.env', 'utf-8'), "https://sepolia.infura.io/v3/d2f9fee04cef4dfc930ae76c1ba9c42d")
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  db: {
    enabled: false,
    host: "127.0.0.1"
  }
};
