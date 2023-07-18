export interface IKeyStoreAddress {
  address: string;
  gas: number;
}

export interface IKeyStore {
  address: Array<IKeyStoreAddress>;
  gasAvailable: number;
  tx: number;
  defaultNetwork: number;
  worksFor: number;
}
