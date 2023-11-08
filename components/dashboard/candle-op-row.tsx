import Image from "next/image";

function DashArrow() {
  return (
    <Image src="/icons/dash-arrow.png" width={36} height={6} alt="arrow" />
  );
}

export default function CandleOpRow({
  text,
  onEdit,
}: {
  text: string;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center">
      <DashArrow />
      <span
        className="mx-2 cursor-pointer text-sm text-[#333]"
        onClick={onEdit}
      >
        {text}
      </span>
      <Image
        className="cursor-pointer"
        onClick={onEdit}
        src="/icons/edit.svg"
        width={20}
        height={20}
        alt="edit"
      />
    </div>
  );
}
