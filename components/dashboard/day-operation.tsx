"use client";

import { Button } from "../ui/button";
import DayTasks from "./day-tasks";

import Plan from "./plan";
import Rules from "./rules";

export default function DayOperation() {
  return (
    <div className="w-[400px] border-l border-[#d6d6d6] bg-[#fafafa]">
      <div className="p-3 shadow-md">
        <Plan />
        <Rules />
        <div className="flex justify-between">
          <Button className="w-[100px] border border-primary bg-white text-primary hover:brightness-95">
            Reset
          </Button>
          <Button className="w-[100px] border border-primary bg-white text-primary hover:brightness-95">
            Save
          </Button>
          <Button className="w-[152px] border border-primary bg-primary text-white hover:brightness-95">
            Apply
          </Button>
        </div>
      </div>

      <DayTasks />
    </div>
  );
}
