export function groupByCategory<T extends { category: string }>(arr: T[]) {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const key = item.category
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}
