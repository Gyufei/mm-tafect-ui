export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-stretch overflow-y-hidden bg-[#fafafa]">
      {children};
    </div>
  );
}
