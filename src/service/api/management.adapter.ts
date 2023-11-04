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
