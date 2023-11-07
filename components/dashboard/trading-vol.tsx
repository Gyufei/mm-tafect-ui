import Image from "next/image";
import numbro from "numbro";

export default function TradingVol() {
  const handleEdit = () => {};
  const totalValue = 100000;

  const displayValue = numbro(totalValue).format({ thousandSeparated: true });

  return (
    <div className="flex flex-col rounded-md border border-[#bfbfbf]  bg-[#f6f7f8] p-3">
      <div className="text-sm text-[#707070]">Total Trading Vol.</div>
      <div className="flex items-center">
        <span className="mr-2 text-lg text-[#333]">${displayValue}</span>
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
