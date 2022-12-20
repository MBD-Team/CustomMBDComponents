export function chunk<T>(array: T[], chunkSize: number): T[][] {
  if (!chunkSize) return [[]];
  let R = [] as T[][];
  for (let i = 0; i < array.length; i += chunkSize) R.push(array.slice(i, i + chunkSize));
  return R;
}
