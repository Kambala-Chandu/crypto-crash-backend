// In-memory wallet balances (reset every server restart)
const wallets = {};

function getWalletBalance(address) {
  if (!wallets[address]) {
    wallets[address] = 100; // Start with $100
  }
  return wallets[address];
}

function updateWallet(address, amount) {
  if (!wallets[address]) {
    wallets[address] = 100;
  }
  wallets[address] += amount;
}

module.exports = { getWalletBalance, updateWallet };
