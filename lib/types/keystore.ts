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
