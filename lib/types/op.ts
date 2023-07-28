interface OperationDetail {
  chain_id: number;
  create_at: string;
  id: number;
  swap_quoter_address: string;
  swap_router: string;
  swap_router_name: string;
  swap_type: number;
}

export interface IOp {
  op_detail: OperationDetail | null;
  op_id: number;
  op_name: string;
}
