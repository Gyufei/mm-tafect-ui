import "./index.css";

import KeyStoreLinks from "@/components/keyStore/keyStoreLinks";

export default async function KeyStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-stretch bg-[#fafafa] pl-3">
      <div
        className="flex w-[284px] flex-col items-start justify-between bg-[#f4f5fa]"
        style={{
          boxShadow: "inset -1px 0px 0px 0px #d6d6d6",
        }}
      >
        <KeyStoreLinks></KeyStoreLinks>
      </div>
      {children}
    </div>
  );
}
