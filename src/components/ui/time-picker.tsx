// src/components/ui/time-picker.tsx
"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"

interface TimePickerProps {
  date: Date
  setDate: (date: Date) => void
  disabled?: boolean
  className?: string
}

export function TimePicker({ date, setDate, disabled, className }: TimePickerProps) {
  const [isPicking, setIsPicking] = React.useState(false)

  const hours = date.getHours()
  const minutes = date.getMinutes()

  const handleHourClick = (hour: number) => {
    const updatedDate = new Date(date)
    updatedDate.setHours(hour)
    setDate(updatedDate)
    setIsPicking(true)
  }

  const handleMinuteClick = (minute: number) => {
    const updatedDate = new Date(date)
    updatedDate.setMinutes(minute)
    setDate(updatedDate)
    setIsPicking(false)
  }

  const hoursArray = Array.from({ length: 24 }, (_, i) => i)
  const minutesArray = Array.from({ length: 12 }, (_, i) => i * 5)

  return (
    <Popover open={isPicking} onOpenChange={setIsPicking}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn("w-32 justify-start text-left font-normal", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        {!isPicking ? (
          <div className="grid grid-cols-4 gap-2">
            {hoursArray.map((hour) => (
              <Button
                key={hour}
                variant="ghost"
                onClick={() => handleHourClick(hour)}
                className={cn(
                  "w-12",
                  hour === hours && "bg-primary text-primary-foreground"
                )}
              >
                {hour.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {minutesArray.map((minute) => (
              <Button
                key={minute}
                variant="ghost"
                onClick={() => handleMinuteClick(minute)}
                className={cn(
                  "w-12",
                  minute === minutes && "bg-primary text-primary-foreground"
                )}
              >
                {minute.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
