"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export function Calendar({ selected, onSelect }: {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
}) {
  return (
    <div className="p-2 border rounded-md shadow bg-white">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={onSelect}
        className="text-sm"
      />
    </div>
  );
}
