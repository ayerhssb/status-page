"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { cn } from "@/lib/utils"

interface CalendarProps {
  mode: "single"
  selected?: Date
  onSelect?: (date?: Date) => void
  initialFocus?: boolean
  wrapperClassName?: string
}

export function Calendar({ wrapperClassName, ...props }: CalendarProps) {
  return (
    <div className={cn("p-3 bg-white dark:bg-neutral-950 rounded-md shadow", wrapperClassName)}>
      <DayPicker
        showOutsideDays
        {...props}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption_label: "text-sm font-medium",
          nav: "flex items-center gap-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-selected)]:bg-neutral-900 [&:has([aria-selected].day-selected)]:text-white dark:[&:has([aria-selected].day-selected)]:bg-neutral-50 dark:[&:has([aria-selected].day-selected)]:text-neutral-900",
          day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          day_selected: "bg-neutral-900 text-white hover:bg-neutral-900 dark:bg-neutral-50 dark:text-neutral-900",
          day_today: "bg-neutral-100 dark:bg-neutral-800",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-neutral-100 aria-selected:text-neutral-900",
          day_hidden: "invisible",
        }}
        components={{
          Navigation: ({ nextMonth, previousMonth, onNextClick, onPrevClick }) => (
            <div className="flex justify-between px-2 pb-2">
              <button
                onClick={() => onPrevClick?.()}
                disabled={!previousMonth}
                className="rounded p-1 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNextClick?.()}
                disabled={!nextMonth}
                className="rounded p-1 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ),
        }}
      />
    </div>
  )
}
