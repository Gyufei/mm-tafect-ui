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
  accountBalance: WithHost("/web3/batch_token_balanceof"),

  // accountGas: WithHost("/web3/balanceof"),
};
