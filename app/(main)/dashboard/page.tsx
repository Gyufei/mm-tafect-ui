import Calendar from "@/components/dashboard/calendar";
import DayOperation from "@/components/dashboard/day-operation";

export default function Dashboard() {
  return (
    <div className="flex h-[calc(100vh-70px)] items-stretch justify-between">
      <Calendar />
      <DayOperation />
    </div>
  );
}
