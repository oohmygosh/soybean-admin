import type { TreeOption } from 'naive-ui';
import { dictApi } from '~/src/service';
import type { DictState } from '.';

export async function initDictStore() {
  const dict: DictState = {};
  const { data } = await dictApi.listTree();
  if (!data) return dict;
  data.forEach((item: ApiDictManagement.SysDict & TreeOption) => {
    const dictItem = item.children?.map((child: ApiDictManagement.SysDict & TreeOption) => {
      const { name, code } = child;
      return { name: name ?? '', code: code ?? '' };
    });
    dict[item.code ?? ''] = {
      name: item.name ?? '',
      values: dictItem ?? []
    };
    item.values = item.children;
  });
  return dict;
}
