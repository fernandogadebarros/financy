import clsx from "clsx"
import { cn } from "@utils/cn"
import { formatDateLabel, parseDate, toDateInputValue } from "@utils/date"
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover"
import { Calendar } from "@/core/components/ui/calendar"

interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "Selecione", className }: DatePickerProps) {
  const selectedDate = parseDate(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "cursor-pointer flex h-10 w-full items-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left text-sm outline-none transition-colors focus:border-brand-base",
            className
          )}
        >
          <span className={clsx("text-gray-400", value && "text-gray-800")}>
            {value ? formatDateLabel(value) : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) onChange(toDateInputValue(date))
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
