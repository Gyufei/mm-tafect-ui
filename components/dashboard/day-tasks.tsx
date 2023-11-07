import { useMemo } from "react";
import { ITask } from "@/lib/types/task";
import { useParseTasks } from "@/lib/hooks/use-parse-task";

import Empty from "../shared/empty";
import SwapHistoryItem from "../token-swap/swap-history-item";

const resTask = [
  {
    account: "0x3c0B7e4FC78C4B7115cb9305878ECCbF66b43dfb",
    create_time: "2023-10-23 05:57:31",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x3c0B7e4FC78C4B7115cb9305878ECCbF66b43dfb","recipient":"0x3c0B7e4FC78C4B7115cb9305878ECCbF66b43dfb","token_in":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","token_out":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","amount":"0.11","swap_router_address":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","is_exact_input":true,"timeout":1800,"slippage":"0.02","nonce":47,"gas":"42000000000","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698249600",
    id: 962,
    message_key: "65d7fee8-f5fc-42bd-968d-dc0ed044fe0a",
    op: 1,
    schedule: "1698249600",
    status: 6,
    tx_hash: null,
    update_time: "2023-10-23 05:57:31",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x8339982fb646A87cDEb3B4523fcA24c999A1e0ff",
    create_time: "2023-10-23 06:57:36",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x8339982fb646A87cDEb3B4523fcA24c999A1e0ff","token":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","spender":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","amount":"115792089237316195423570985008687907853269984665640564039457584007913129639935","nonce":0,"gas":"102000000000","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698044256",
    id: 975,
    message_key: "22fa08f4-e2c7-42ab-83d2-718560565fed",
    op: 3,
    schedule: "1698044253",
    status: 4,
    tx_hash:
      "0x6261df65f623dc2f193d8a928e38342651380591cc69104519d7b2c60d87a1cd",
    update_time: "2023-10-23 06:57:36",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x8339982fb646A87cDEb3B4523fcA24c999A1e0ff",
    create_time: "2023-10-23 07:02:39",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x8339982fb646A87cDEb3B4523fcA24c999A1e0ff","recipient":"0x49B2118d7a1bB2A81A52230C6317E3fb5b71Bcf0","amount":"0.01","nonce":2,"gas":"82000000000","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698044564",
    id: 979,
    message_key: "534bca7b-9072-49f3-8b2d-81cc5fcc1184",
    op: 2,
    schedule: "1698044269",
    status: 4,
    tx_hash:
      "0xbcc950f3f44f5a38db9d8dd9492c9d7e7ada86d6bd9d1f48cc4a9eb2dc7d4075",
    update_time: "2023-10-23 07:02:39",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x49B2118d7a1bB2A81A52230C6317E3fb5b71Bcf0",
    create_time: "2023-10-24 07:13:49",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x49B2118d7a1bB2A81A52230C6317E3fb5b71Bcf0","token":"0xE9854bF0e1dE0ba04Df85DEc9Be6c1d3FBc22553","spender":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","amount":"115792089237316195423570985008687907853269984665640564039457584007913129639935","nonce":0,"gas":"213576266691","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698132864",
    id: 980,
    message_key: "4fdda8e9-d9a0-4cc4-b464-f1696bd52220",
    op: 3,
    schedule: "1698131627",
    status: 4,
    tx_hash:
      "0x3899ed9a3c878729640880645981cd5a871f9affa60e68a2b2dde83c25e6bbc9",
    update_time: "2023-10-24 07:13:49",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x77b9fec3320a5d486929dea189e43B20fc5C9E47",
    create_time: "2023-10-25 02:07:37",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","recipient":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","token_in":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","token_out":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","amount":"0.001","swap_router_address":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","is_exact_input":true,"timeout":1800,"slippage":"0.02","nonce":0,"gas":"54","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698199660",
    id: 983,
    message_key: "8e6c227f-1a0e-4d41-8b5f-11e96bff9596",
    op: 1,
    schedule: "1698199464",
    status: 4,
    tx_hash:
      "0x995b294575f1124ca2f710c85a57f35d255617ea9cef40f3be2d57e2e9d906c3",
    update_time: "2023-10-25 02:07:37",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x77b9fec3320a5d486929dea189e43B20fc5C9E47",
    create_time: "2023-10-25 02:09:05",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","token":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","spender":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","amount":"115792089237316195423570985008687907853269984665640564039457584007913129639935","nonce":1,"gas":"48","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698199747",
    id: 984,
    message_key: "826e4fb0-1469-4a34-971b-761ee2ddd99c",
    op: 3,
    schedule: "1698199739",
    status: 4,
    tx_hash:
      "0xc6372d303c631dfa0d5e9a202274860be045fc906aeb7f27a330b412a35184aa",
    update_time: "2023-10-25 02:09:05",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x77b9fec3320a5d486929dea189e43B20fc5C9E47",
    create_time: "2023-10-25 02:09:58",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","token":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","spender":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","amount":"115792089237316195423570985008687907853269984665640564039457584007913129639935","nonce":1,"gas":"48","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698272005",
    id: 985,
    message_key: "e569fe7b-472e-4f82-946d-b333a58bca86",
    op: 3,
    schedule: "1698199739",
    status: 7,
    tx_hash: null,
    update_time: "2023-10-25 02:09:58",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x77b9fec3320a5d486929dea189e43B20fc5C9E47",
    create_time: "2023-10-25 06:15:23",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","recipient":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","token_in":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","token_out":"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE","amount":"0.01","swap_router_address":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","is_exact_input":true,"timeout":1800,"slippage":"0.02","nonce":2,"gas":"81390425820","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698214523",
    id: 986,
    message_key: "7aa24db8-750a-4b84-bb7e-d32ce24b670f",
    op: 1,
    schedule: "1698214513",
    status: 4,
    tx_hash:
      "0x4d04a5d46fc3ac2e03c5c54de1b250d57f84cb14f837bd5307fe1449a60f5022",
    update_time: "2023-10-25 06:15:23",
    user_name: "xiaoming@163.com",
  },
  {
    account: "0x77b9fec3320a5d486929dea189e43B20fc5C9E47",
    create_time: "2023-10-25 06:16:46",
    data: '{"chain_id":"11155111","keystore":"test","account":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","recipient":"0x77b9fec3320a5d486929dea189e43B20fc5C9E47","token_in":"0xd2bB751e65fD6DBb224872ED7Df807f29b0F98aa","token_out":"0xE9854bF0e1dE0ba04Df85DEc9Be6c1d3FBc22553","amount":"1.2","swap_router_address":"0x6d16966427dd46A844632A7b2C1f733aA9d46D26","is_exact_input":true,"timeout":1800,"slippage":"0.02","nonce":3,"gas":"84896804563","fixed_gas":false,"no_check_gas":false}',
    execute_time: "1698214647",
    id: 987,
    message_key: "76ed68fc-1a98-4132-8948-dfe7f3ec2e5f",
    op: 1,
    schedule: "1698214513",
    status: 4,
    tx_hash:
      "0xe96dc6c652010ca7c9b95e6b2e95570e9803598678464afc4e2c4ae1499024c3",
    update_time: "2023-10-25 06:16:46",
    user_name: "xiaoming@163.com",
  },
];

export default function DayTasks() {
  const { parsedTaskFunc, isCanParse } = useParseTasks();

  const onCancel = () => {};

  const tasks: Array<ITask> = useMemo(() => {
    if (!isCanParse) {
      return [];
    }
    return parsedTaskFunc(resTask);
  }, [isCanParse, parsedTaskFunc]);
  return (
    <div className="relative border-t">
      <div className="flex h-[calc(100vh-455px)] flex-col justify-stretch gap-y-3 overflow-y-auto px-3 pb-2">
        {tasks?.length ? (
          tasks.map((task) => (
            <SwapHistoryItem key={task.id} task={task} onCancel={onCancel} />
          ))
        ) : Array.isArray(tasks) ? (
          <Empty />
        ) : null}
      </div>
    </div>
  );
}
