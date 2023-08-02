import { LINKS } from "@/lib/constants";

export function TopBar({ pathname }: { pathname: string }) {
  const title = LINKS.find(
    (link) => link.href === pathname || pathname.includes(link.href),
  )?.name;

  return (
    <div
      className="flex h-[70px] min-h-[70px] items-center justify-start bg-white"
      style={{
        boxShadow: "inset 0px -1px 0px 0px #d6d6d6",
      }}
    >
      <div className="ml-3 h-12 w-12 rounded-full bg-[#d8d8d8]"></div>
      <div className="flex flex-1 items-center justify-center">{title}</div>
    </div>
  );
}
