import Image from "next/image";

export default function Rules() {
  const gasPrice = "100";
  const onEditGas = () => {};

  const minTxSpan = "1";
  const onEditMinTxSpan = () => {};

  return (
    <div className="mb-[22px]">
      <div className="LabelText mb-1">Rules</div>
      <div className="flex gap-x-3">
        <GasPrice value={gasPrice} onValueChange={onEditGas} />
        <MinTxSpan value={minTxSpan} onValueChange={onEditMinTxSpan} />
      </div>
    </div>
  );
}

function GasPrice({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col rounded-md border border-[#bfbfbf] p-3">
      <div className="LabelText">Gas Price</div>
      <div className="flex items-center">
        <span className="mr-2 text-lg text-[#333]">Max {value}</span>
        <Image
          className="cursor-pointer"
          onClick={onValueChange}
          src="/icons/edit.svg"
          width={20}
          height={20}
          alt="edit"
        />
      </div>
    </div>
  );
}

function MinTxSpan({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: () => void;
}) {
  const postfix = Number(value) > 1 ? "Hours" : "Hour";

  return (
    <div className="flex flex-1 flex-col rounded-md border border-[#bfbfbf] p-3">
      <div className="LabelText">Min Tx Span</div>
      <div className="flex items-center">
        <span className="mr-2 text-lg text-[#333]">
          {value} {postfix}
        </span>
        <Image
          className="cursor-pointer"
          onClick={onValueChange}
          src="/icons/edit.svg"
          width={20}
          height={20}
          alt="edit"
        />
      </div>
    </div>
  );
}
