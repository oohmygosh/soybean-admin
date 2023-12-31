import type { TreeOption } from 'naive-ui';

export function adapterOfFetchPage<T extends Page<M>, M extends BaseEntity>(data: T | null): T {
  if (!data) return <T>{};
  const { current, size } = data;
  let startIndex = current * size - size;
  data.records = data.records.map(item => {
    const entity: M = {
      index: ++startIndex,
      ...item
    };
    return entity;
  });
  return data;
}

export function adapterOfFillKey<T extends TreeOption>(data: T[] | null): T[] {
  if (!data) return [];
  let startIndex = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const fillKey = (param: TreeOption) => {
    param.key = ++startIndex;
    if (param.children) param.children.forEach(item => fillKey(item));
  };
  data.forEach(item => fillKey(item));
  return data;
}
