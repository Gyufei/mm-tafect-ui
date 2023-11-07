import Image from "next/image";

export default function TradingTx() {
  const handleEdit = () => {};

  const txValue = 60;

  return (
    <div className="flex flex-col rounded-md border bg-[#f6f7f8] border-[#bfbfbf] p-3">
      <div className="text-sm text-[#707070]">Trading Tx</div>
      <div className="flex items-center">
        <span className="mr-2 text-lg text-[#333]">{txValue}</span>
        <Image
          className="cursor-pointer"
          onClick={handleEdit}
          src="/icons/edit.svg"
          width={20}
          height={20}
          alt="edit"
        />
      </div>
    </div>
  );
}
