"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isEqual,
  isSameMonth,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayNames } from "@/lib/constants";

export default function Home() {
  // handle dates
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [selectedDay, setSelectedDay] = useState(today);
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const daysOfMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 0 }),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 0 }),
      }),
    [firstDayCurrentMonth],
  );

  // next and prev month functions
  function prevMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="border-b border-[#d6d6d6] bg-[#f6f7f8] py-3">
        <div className="mb-2 flex items-center justify-center">
          <button type="button" className="mr-2" onClick={prevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="mx-3 text-lg">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            className="flex justify-end"
            onClick={nextMonth}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7">
          {DayNames.map((day, i) => {
            return (
              <div
                key={i}
                className="flex w-full items-center justify-center text-sm text-[#707070]"
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-7 justify-items-center gap-y-3 overflow-y-auto pb-4">
        {daysOfMonth.map((day) => {
          return (
            <DayItem
              key={day.toString()}
              day={day}
              selectedDay={selectedDay}
              firstDayCurrentMonth={firstDayCurrentMonth}
              onClick={() => setSelectedDay(day)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayItem({
  day,
  selectedDay,
  onClick,
  firstDayCurrentMonth,
}: {
  day: Date;
  selectedDay: Date;
  firstDayCurrentMonth: Date;
  onClick: () => void;
}) {
  const today = startOfToday();

  const isSelected = isEqual(day, selectedDay);
  const isBeforeDay = isBefore(day, today);
  const isThisMonth = isSameMonth(day, firstDayCurrentMonth);

  return (
    <div
      onClick={onClick}
      data-month={isThisMonth ? "curr" : "other"}
      data-selected={isSelected}
      className="flex h-[130px] w-[100px] cursor-pointer flex-col rounded-md border border-[#bfbfbf] px-[6px] py-2 data-[selected=true]:border-b-4 data-[selected=true]:border-[#0E56E666] data-[selected=true]:border-b-[#0E56E6] data-[selected=true]:bg-[#0E56E605] data-[month=other]:opacity-40"
    >
      <div className="px-[6px]">
        <div className="flex items-center">
          <div
            data-month={isThisMonth ? "curr" : "other"}
            className="mr-1 text-lg leading-[26px] text-[#0E56E6] data-[month=other]:text-[#333]"
          >
            {format(day, "d")}
          </div>
          <div className="text-sm leading-5">
            <ProfitNum num={day.getDate() - 3} />
          </div>
        </div>

        {isBeforeDay && (
          <>
            <div className="mt-1 text-xs leading-[17px] text-[#707070]">
              Gas Used
            </div>
            <div className="text-sm text-[#333]">0.2 ETH</div>
          </>
        )}

        <div className="mt-[6px] text-xs text-[#707070]">Tx</div>
        <div className="text-sm text-[#333]">60 (100%)</div>
      </div>

      {!isBeforeDay && (
        <div className="mt-[29px] flex h-5 items-center rounded-sm bg-[#0E56E60F]">
          <Image
            src="/icons/plan.svg"
            alt="plan"
            width={14}
            height={14}
            className="mx-1"
          />
          <div className="text-xs text-[#0E56E6]">New Plan</div>
        </div>
      )}
    </div>
  );
}

function ProfitNum({ num }: { num: number }) {
  const isGreaterThanZero = num > 0;
  const prefix = isGreaterThanZero ? "+" : "-";
  const absNum = Math.abs(num);

  return (
    <span
      data-state={isGreaterThanZero ? "positive" : "negative"}
      className="data-[state='negative']:text-[#D42C1F] data-[state='positive']:text-[#07D498]"
    >
      {prefix}
      {absNum}%
    </span>
  );
}
