export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
      }}
      className="flex w-screen flex-col bg-[#fafafa] md:w-auto md:flex-row md:items-stretch"
    >
      {children}
    </div>
  );
}
