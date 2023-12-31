export interface IKeyStore {
  create_time: string;
  id: number;
  keystore_name: string;
  range: Array<IKeyStoreRange>;
  user_id: number;
}

export interface IKeyStoreRange {
  root_account: string;
  from_index: number;
  to_index: number;
}

export interface IKeyStoreAccount {
  name: string;
  accounts: Array<IKeyStoreAccountItem>;
  count: number;
  accountLoading: boolean;
}

export interface IKeyStoreAccountItem {
  account: string;
  gas: string;
  tx: number;
  index: number;
}
