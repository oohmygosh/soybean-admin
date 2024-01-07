import type { TreeOption } from 'naive-ui';
import { dictApi } from '~/src/service';
import type { DictState } from '.';

export async function initDictStore() {
  const dict: DictState = <DictState>{};
  const { data } = await dictApi.listTree();
  if (!data) return dict;
  data.forEach((item: ApiDictManagement.SysDict & TreeOption) => {
    const dictItem: Record<string, ApiDictManagement.SysDict> = {};
    item.children?.forEach((child: ApiDictManagement.SysDict & TreeOption) => {
      const { code, name, content, remark } = child;
      dictItem[code ?? ''] = { code, name, content, remark };
    });
    if (item.code)
      dict[item.code] = {
        name: item.name ?? '',
        values: dictItem
      };
    item.values = item.children;
  });
  return dict;
}
