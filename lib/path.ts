function WithHost(path: string) {
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
}

export const PathMap = {
  login: WithHost("/user/login"),
  keyStores: WithHost("/user/keystore"),
  keyStoreAccounts: WithHost("/keystore/accounts"),
};
