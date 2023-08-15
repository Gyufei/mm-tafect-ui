export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full bg-[#fafafa] md:static md:overflow-y-hidden">
      {children}
    </div>
  );
}
