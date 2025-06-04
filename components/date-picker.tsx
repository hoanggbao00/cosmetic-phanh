"use client"

import { Calendar } from "@/components/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"

interface DatePickerProps {
  value: Date | null
  onChange: (date: Date | null) => void
  className?: string
}

export default function DatePicker({ value, onChange, className }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | null>(value)

  React.useEffect(() => {
    onChange(date)
  }, [date, onChange])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date ?? undefined} onSelect={setDate} autoFocus />
      </PopoverContent>
    </Popover>
  )
}
