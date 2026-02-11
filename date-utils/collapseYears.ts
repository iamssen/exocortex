export interface CollapseYearsResult<T> {
  list: T[];
  collapsed?: { from: number; to: number; list: T[] };
}

interface Item<T> {
  y: number;
  v: T;
}

export function collapseYears<T>(
  list: T[],
  year: keyof T | ((item: T) => number),
  filterBefore: number,
  collapseAfter: number,
): CollapseYearsResult<T> {
  const items: Item<T>[] = list
    .map((item) => ({
      y: typeof year === 'function' ? year(item) : (item[year] as number),
      v: item,
    }))
    .filter(({ y }) => y >= filterBefore)
    .toSorted((a, b) => a.y - b.y);
  const collapseIndex = items.findIndex(({ y }) => y >= collapseAfter);

  if (
    // if there are less than 5 items
    items.length < 5 ||
    // if there is no before item than the reduceFromYear
    collapseIndex === 0 ||
    // if there are less than 2 items after the reduceFromYear
    collapseIndex > items.length - 2
  ) {
    return {
      list: items.map(({ v }) => v),
    };
  }

  const before = collapseIndex !== -1 ? items.slice(0, collapseIndex) : [];
  const after = collapseIndex !== -1 ? items.slice(collapseIndex) : items;

  return {
    list: before.map(({ v }) => v),
    collapsed: {
      from: collapseAfter,
      to: after.at(-1)?.y ?? collapseAfter,
      list: after.map(({ v }) => v),
    },
  };
}
