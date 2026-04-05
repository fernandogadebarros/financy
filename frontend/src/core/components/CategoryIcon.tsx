import clsx from "clsx"
import {
  BriefcaseBusiness, CarFront, HeartPulse, PiggyBank,
  ShoppingCart, Ticket, ReceiptText, Utensils,
  PawPrint, House, Gift, Tag,
  BookOpen, Wallet, CircleArrowUp, BaggageClaim,
  Dumbbell, type LucideProps,
} from "lucide-react"
import type { FC } from "react"
import { getCategoryColorClasses } from "@utils/categoryColors"

const ICON_MAP: Record<string, FC<LucideProps>> = {
  briefcase: BriefcaseBusiness,
  car: CarFront,
  heart: HeartPulse,
  "piggy-bank": PiggyBank,
  "shopping-cart": ShoppingCart,
  ticket: Ticket,
  "calendar-days": ReceiptText,
  utensils: Utensils,
  footprints: PawPrint,
  house: House,
  gift: Gift,
  sparkles: Gift,
  "book-open": BookOpen,
  "hand-coins": Wallet,
  wallet: Wallet,
  "receipt-text": ReceiptText,
  gamepad2: Tag,
  music: Ticket,
  home: House,
  bus: BaggageClaim,
  "trending-up": CircleArrowUp,
  coffee: Utensils,
  dumbbell: Dumbbell,
  tag: Tag,
}

interface CategoryIconProps {
  icon: string
  color: string
  size?: "xs" | "sm" | "md"
}

const SIZE_STYLES = {
  xs: { wrapper: "size-9", icon: "size-3.5" },
  sm: { wrapper: "size-8", icon: "size-4" },
  md: { wrapper: "size-10", icon: "size-5" },
} as const

export default function CategoryIcon({ icon, color, size = "md" }: CategoryIconProps) {
  const Icon = ICON_MAP[icon] ?? Tag
  const sizeStyles = SIZE_STYLES[size]
  const colorClasses = getCategoryColorClasses(color)

  return (
    <div
      className={clsx(
        sizeStyles.wrapper,
        "rounded-lg flex items-center justify-center shrink-0",
        colorClasses.tintBg
      )}
    >
      <Icon className={clsx(sizeStyles.icon, colorClasses.text)} />
    </div>
  )
}
