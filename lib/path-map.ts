function WithHost(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export const PathMap = {
  login: WithHost("/user/login"),

  userKeyStores: WithHost("/keystore/user"),
  deleteKeyStore: WithHost("/keystore/user/remove"),
  keyStoreAccounts: WithHost("/keystore/accounts"),
  allPages: WithHost("/keystore/pages/all"),
  keyStorePages: WithHost("/keystore/pages"),
  keyStoreRemovePage: WithHost("/keystore/pages/remove"),
  keyStoreAddPage: WithHost("/keystore/pages/add"),

  networks: WithHost("/setting/networks"),
  ops: WithHost("/setting/op"),

  web3Info: WithHost("/tokenswap/info"),
  tokenList: WithHost("/tokenswap/token_list"),
  filterAccount: WithHost("/tokenswap/filter_account"),
  estimateToken: WithHost("/tokenswap/estimate_token_amount"),
  signSwap: WithHost("/tokenswap/swap/sign"),
  signApprove: WithHost("/tokenswap/transfer/sign"),
  signTransfer: WithHost("/tokenswap/approve/sign"),
  sendSwap: WithHost("/tokenswap/swap/send"),
  sendApprove: WithHost("/tokenswap/transfer/send"),
  sendTransfer: WithHost("/tokenswap/approve/send"),
  swapHistory: WithHost("/tokenswap/history"),

  accountTokensBalance: WithHost("/web3/batch_token_balanceof"),
  accountTokenBalance: WithHost("/web3/balanceof"),
  gasPrice: WithHost("/web3/gas_price"),
  nonceNum: WithHost("/web3/nonce"),

  // not-use
  accountGas: WithHost("/web3/balanceof"),
};
