export function changeResponse<T extends { label: string; value: string }>(
  list: T[],
  value: string
) {
  return list.find((item) => item.value === value)?.label;
}
