export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid h-full grid-cols-1 bg-[#fafafa] md:static md:grid-cols-3 md:overflow-y-hidden">
      {children}
    </div>
  );
}
