export function parseDate(value?: string): Date | undefined {
  if (!value) return undefined

  const [y, m, d] = value.split("-").map(Number)
  if (!y || !m || !d) return undefined

  return new Date(y, m - 1, d)
}

export function formatDateLabel(value: string): string {
  const date = parseDate(value)
  return date ? date.toLocaleDateString("pt-BR") : value
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
