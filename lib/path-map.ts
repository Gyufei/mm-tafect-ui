function WithHost(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export const PathMap = {
  login: WithHost("/user/login"),

  userKeyStores: WithHost("/keystore/user"),
  keyStoreAccounts: WithHost("/keystore/accounts"),
  allPages: WithHost("/keystore/pages/all"),
  keyStorePages: WithHost("/keystore/pages"),
  keyStoreRemovePage: WithHost("/keystore/pages/remove"),
  keyStoreAddPage: WithHost("/keystore/pages/add"),

  tokenList: WithHost("/tokenswap/token_list"),
  filterAccount: WithHost("/tokenswap/filter_account"),

  ops: WithHost("/setting/op"),
  networks: WithHost("/setting/networks"),
  accountTokenBalance: WithHost("/web3/token_balanceof"),
  accountTokensBalance: WithHost("/web3/batch_token_balanceof"),
  estimateToken: WithHost("/tokenswap/estimate_token_amount"),

  gasPrice: WithHost("/web3/gas_price"),
  nonceNum: WithHost("/web3/nonce"),

  signSwap: WithHost("/tokenswap/swap/sign"),
  signApprove: WithHost("/tokenswap/transfer/sign"),
  signTransfer: WithHost("/tokenswap/approve/sign"),
  sendSwap: WithHost("/tokenswap/swap/send"),
  sendApprove: WithHost("/tokenswap/transfer/send"),
  sendTransfer: WithHost("/tokenswap/approve/send"),

  // accountGas: WithHost("/web3/balanceof"),
};
