function WithHost(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export const PathMap = {
  login: WithHost("/user/login"),
  keyStores: WithHost("/user/keystore"),
  keyStoreAccounts: WithHost("/keystore/accounts"),
  accountGas: WithHost("/web3/balanceof"),
  tokenList: WithHost("/tokenswap/token_list"),
  filterAccount: WithHost("/tokenswap/filter_account"),
};
