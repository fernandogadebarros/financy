export function getItemLabel(count: number): "item" | "items" {
  return count === 1 ? "item" : "items"
}
