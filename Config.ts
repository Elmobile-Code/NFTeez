import nearAPI from "near-api-js";

export const parasConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  appName: "Paras Testnet",
  contractName: `paras-token-v2.testnet`
};

export const nearKeyStore = new nearAPI.keyStores.UnencryptedFileSystemKeyStore(`./Keystore/`);

// A connection object to the near network that will work with the paras contract
export const nearConnection = await nearAPI.connect({
  deps: {
    keyStore: nearKeyStore
  },
  ...parasConfig
});

export const walletId = "baf-near-project";
export const wallet = await nearConnection.account(walletId);

export const parasContract = new nearAPI.Contract(wallet, parasConfig.contractName, {
  changeMethods: ["nft_create_series"],
  // TODO make sure this works
  viewMethods: ["nft_get_series_by_id"],
  useLocalViewExecution: true
});
