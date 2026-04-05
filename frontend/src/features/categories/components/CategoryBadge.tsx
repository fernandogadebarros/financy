import clsx from "clsx"
import { getCategoryColorClasses } from "@utils/categoryColors"

interface CategoryBadgeProps {
  name: string
  color: string
}

export default function CategoryBadge({ name, color }: CategoryBadgeProps) {
  const colorClasses = getCategoryColorClasses(color)

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-medium leading-none whitespace-nowrap",
        colorClasses.tintBg,
        colorClasses.text
      )}
    >
      {name}
    </span>
  )
}
