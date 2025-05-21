"use client";
import React, { useState, useCallback, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format, addDays } from "date-fns";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css

export default function Test({ onSelectDays }) {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  // Calculate dates on initial render
  useEffect(() => {
    if (onSelectDays) {
      const start = range[0].startDate;
      const end = range[0].endDate;

      const date = new Date(start);
      const dates = [];

      while (date <= end) {
        dates.push(format(new Date(date), "yyyy-MM-dd"));
        date.setDate(date.getDate() + 1);
      }

      console.log("Initial dates:", dates);
      onSelectDays(dates);
    }
  }, [onSelectDays, range]);

  // Handle range change and calculate dates in one function
  const handleRangeChange = useCallback(
    (item) => {
      setRange([item.selection]);

      // Calculate dates only when range changes
      const start = item.selection.startDate;
      const end = item.selection.endDate;

      const date = new Date(start);
      const dates = [];

      while (date <= end) {
        dates.push(format(new Date(date), "yyyy-MM-dd"));
        date.setDate(date.getDate() + 1);
      }

      console.log("Range changed, dates:", dates);

      // Pass dates to parent
      if (onSelectDays) {
        onSelectDays(dates);
      }
    },
    [onSelectDays]
  );

  return (
    <div className="p-4 w-fit" dir="ltr">
      <h2 className="text-lg font-semibold mb-2 text-right">اختر الأيام</h2>
      <DateRange
        className="border-2 border-neutral-200 rounded-xl overflow-hidden"
        editableDateInputs={true}
        onChange={handleRangeChange}
        moveRangeOnFirstSelection={false}
        ranges={range}
      />
      <div className="mt-2 text-sm text-right">
        تم اختيار{" "}
        {range[0].startDate && range[0].endDate
          ? Math.ceil(
              (range[0].endDate - range[0].startDate) / (1000 * 60 * 60 * 24)
            ) + 1
          : 0}{" "}
        يوم
      </div>
    </div>
  );
}
