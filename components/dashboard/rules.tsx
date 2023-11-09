import { GasPrice } from "./gas-price";
import { MinTxSpan } from "./min-tx-span";

export default function Rules() {
  return (
    <div className="mb-[22px]">
      <div className="LabelText mb-1">Rules</div>
      <div className="flex gap-x-3">
        <GasPrice />
        <MinTxSpan />
      </div>
    </div>
  );
}
