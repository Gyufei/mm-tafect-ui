import { cn } from "@/lib/utils";

export default function SessionTip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        className,
        "mt-5 rounded border border-[#DFCA9C] bg-[#FEFAF4] px-4 py-3 text-title-color md:mb-5 md:w-[420px]",
      )}
    >
      Your session ended after 10 minutes of inactivity.
    </div>
  );
}
