import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@utils/cn"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col",
        month: "flex flex-col gap-4",
        month_caption: "relative flex w-full items-center justify-center pt-1",
        caption_label: "text-sm font-medium text-gray-800",
        nav: "absolute inset-x-1 top-1 flex items-center justify-between",
        button_previous:
          "cursor-pointer inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200 p-0 text-gray-500 hover:bg-gray-100",
        button_next:
          "cursor-pointer inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-200 p-0 text-gray-500 hover:bg-gray-100",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-8 text-center text-[11px] font-medium text-gray-500",
        week: "mt-1 flex w-full",
        day: "h-8 w-8 p-0 text-center",
        day_button:
          "cursor-pointer h-8 w-8 rounded-md border border-transparent text-sm text-gray-700 hover:bg-gray-100 aria-selected:border-gray-200 aria-selected:bg-white aria-selected:text-gray-700",
        selected: "text-gray-800 rounded-md bg-gray-200",
        today: "border border-gray-500 rounded-md bg-white text-gray-700",
        outside: "text-gray-300",
        disabled: "text-gray-300 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => (
          orientation === "left"
            ? <ChevronLeft className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
            : <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...chevronProps} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
