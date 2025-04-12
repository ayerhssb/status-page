"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { TimePicker } from "@/components/ui/time-picker"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DayPickerSingleProps } from "react-day-picker"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  placeholder?: string
}

export function DateTimePicker({
  date,
  setDate,
  className,
  placeholder = "Pick a date and time",
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(date)

  const handleTimeChange = (newTime: Date) => {
    if (!selectedDateTime) return
    const updated = new Date(selectedDateTime)
    updated.setHours(newTime.getHours())
    updated.setMinutes(newTime.getMinutes())
    setSelectedDateTime(updated)
    setDate(updated)
  }

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDateTime(undefined)
      setDate(undefined)
      return
    }
    const updated = new Date(newDate)
    if (selectedDateTime) {
      updated.setHours(selectedDateTime.getHours())
      updated.setMinutes(selectedDateTime.getMinutes())
    } else {
      const now = new Date()
      updated.setHours(now.getHours())
      updated.setMinutes(now.getMinutes())
    }
    setSelectedDateTime(updated)
    setDate(updated)
  }

  const calendarProps: DayPickerSingleProps = {
    mode: "single",
    selected: selectedDateTime,
    onSelect: handleDateChange,
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-neutral-500",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP p") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <Calendar {...calendarProps} />
          <div className="border-t pt-4">
            <TimePicker
              setDate={handleTimeChange}
              date={selectedDateTime || new Date()}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
