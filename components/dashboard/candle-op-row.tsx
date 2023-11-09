import Image from "next/image";

function DashArrow() {
  return (
    <Image src="/icons/dash-arrow.png" width={36} height={6} alt="arrow" />
  );
}

export default function CandleOpRow({ text }: { text: string }) {
  return (
    <div className="flex items-center">
      <DashArrow />
      <span className="mx-2 min-w-[55px] cursor-pointer text-sm text-[#333]">
        {text}
      </span>
      <Image
        className="cursor-pointer"
        src="/icons/edit.svg"
        width={20}
        height={20}
        alt="edit"
      />
    </div>
  );
}
