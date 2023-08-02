export interface IToken {
  is_stable_token: boolean;
  address: string;
  chain_id: number;
  decimals: number;
  id: number;
  logo_url: string;
  name: string;
  symbol: string;
}
