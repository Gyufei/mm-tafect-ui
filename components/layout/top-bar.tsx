import Image from "next/image";
import TopBarTitle from "./top-bar-title";

export default function TopBar() {
  return (
    <div
      className="relative flex h-[70px] min-h-[70px] w-full items-center justify-start bg-white"
      style={{
        boxShadow: "inset 0px -1px 0px 0px #d6d6d6",
      }}
    >
      <Image
        src="/logo.svg"
        width={48}
        height={48}
        className="absolute left-3"
        alt="logo"
      />
      <div className="flex flex-1 items-center justify-center">
        <TopBarTitle />
      </div>
    </div>
  );
}
