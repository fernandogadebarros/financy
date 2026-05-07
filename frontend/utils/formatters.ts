const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
]

export function formatCurrency(amountInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(amountInCents / 100)
}

export function formatDate(value: string | number | Date): string {
  if (typeof value === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (match) {
      const [, year, month, day] = match
      return `${day}/${month}/${year.slice(2)}`
    }
  }
  const d = new Date(value)
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = String(d.getFullYear()).slice(2)
  return `${day}/${month}/${year}`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
}

export function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-")
  return `${MONTHS[parseInt(month) - 1]} / ${year}`
}

export function amountToCentsString(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",")
}

export function parseCentsFromString(value: string): number {
  return Math.round(parseFloat(value.replace(",", ".")) * 100)
}
