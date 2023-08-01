export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full grid-cols-3 items-stretch overflow-y-hidden bg-[#fafafa]">
      {children}
    </div>
  );
}
