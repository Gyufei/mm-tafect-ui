function WithHost(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export const SystemEndPointPathMap = {
  login: WithHost("/user/login"),
  logout: WithHost("/user/logout"),
  changePassword: WithHost("/user/change_password"),
  endPoint: WithHost("/user/end_point"),

  userKeyStores: WithHost("/keystore/user"),
  addKeyStore: WithHost("/keystore/user/add"),
  deleteKeyStore: WithHost("/keystore/user/remove"),

  allPages: WithHost("/keystore/pages/all"),
  keyStorePages: WithHost("/keystore/pages"),
  keyStoreRemovePage: WithHost("/keystore/pages/remove"),
  keyStoreAddPage: WithHost("/keystore/pages/add"),

  keyStoreByPage: WithHost("/keystore/list"),

  networks: WithHost("/setting/networks"),
  ops: WithHost("/setting/op"),
};

export const UserEndPointPathMap = {
  keyStoreAccounts: "/keystore/accounts",
  web3Info: "/tokenswap/info",
  tokenList: "/tokenswap/token_list",
  filterAccount: "/tokenswap/filter_account",
  estimateToken: "/tokenswap/estimate_token_amount",
  signTransfer: "/tokenswap/approve/sign",
  signApprove: "/tokenswap/transfer/sign",
  signSwap: "/tokenswap/swap/sign",
  sendTransfer: "/tokenswap/approve/send",
  sendApprove: "/tokenswap/transfer/send",
  sendSwap: "/tokenswap/swap/send",
  swapHistory: "/tokenswap/history",

  accountTokensBalance: "/web3/batch_token_balanceof",
  accountTokenBalance: "/web3/balanceof",
  nonceNum: "/web3/nonce",
  gasPrice: "/web3/gas_price",
};
