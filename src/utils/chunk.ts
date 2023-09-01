export function chunk<T>(array: T[], chunkSize: number): T[][] {
  if (!chunkSize) return [[]];
  const R: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) R.push(array.slice(i, i + chunkSize));
  return R;
}
