export default {};

declare global {
  interface Array<T> {
    groupBy<K extends string>(f: (item: T) => K): { key: K; items: Array<T> }[];
  }
}
Array.prototype.groupBy = function <K extends string>(f: (item: any) => K) {
  return Object.entries(
    this.reduce(function (rv, x) {
      (rv[f(x)] = rv[f(x)] || []).push(x);
      return rv;
    }, {})
  ).map(([key, value]) => ({ key: key as K, items: value as any[] }));
};
