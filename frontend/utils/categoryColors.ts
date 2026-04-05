type CategoryColorClassSet = {
  text: string
  tintBg: string
  swatchBg: string
}

const CATEGORY_COLOR_CLASS_MAP: Record<string, CategoryColorClassSet> = {
  "#16A34A": {
    text: "text-green-base",
    tintBg: "bg-green-light",
    swatchBg: "bg-green-base",
  },
  "#2563EB": {
    text: "text-blue-base",
    tintBg: "bg-blue-light",
    swatchBg: "bg-blue-base",
  },
  "#9333EA": {
    text: "text-purple-base",
    tintBg: "bg-purple-light",
    swatchBg: "bg-purple-base",
  },
  "#DB2777": {
    text: "text-pink-base",
    tintBg: "bg-pink-light",
    swatchBg: "bg-pink-base",
  },
  "#DC2626": {
    text: "text-red-base",
    tintBg: "bg-red-light",
    swatchBg: "bg-red-base",
  },
  "#EA580C": {
    text: "text-orange-base",
    tintBg: "bg-orange-light",
    swatchBg: "bg-orange-base",
  },
  "#CA8A04": {
    text: "text-yellow-base",
    tintBg: "bg-yellow-light",
    swatchBg: "bg-yellow-base",
  },
}

const DEFAULT_CATEGORY_COLOR_CLASSES: CategoryColorClassSet = {
  text: "text-gray-600",
  tintBg: "bg-gray-100",
  swatchBg: "bg-gray-300",
}

export function normalizeHexColor(color: string): string {
  return color.trim().toUpperCase()
}

export function getCategoryColorClasses(color: string): CategoryColorClassSet {
  return CATEGORY_COLOR_CLASS_MAP[normalizeHexColor(color)] ?? DEFAULT_CATEGORY_COLOR_CLASSES
}
