import { defineStore } from 'pinia';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { initDictStore } from './helpers';

export type DictState = {
  [key in DictManagement.DictKey]: {
    name: string;
    values: Record<string, Pick<ApiDictManagement.SysDict, 'code' | 'name' | 'content' | 'remark'>>;
  };
};

export const useDictStore = defineStore('dict-store', {
  state: (): DictState => <DictState>{},
  actions: {
    /** 初始化字典 */
    async initRouteStore() {
      this.$state = await initDictStore();
    },
    /** 读取字典 */
    getDict(code: DictManagement.DictKey) {
      return this.$state[code];
    },
    /** 读取Select */
    getSelect(code: DictManagement.DictKey) {
      const selectOption = { ...this.$state[code], options: [] as SelectMixedOption[] };
      selectOption.options = Object.values(selectOption.values).map((item: (typeof selectOption.values)[0]) => {
        return {
          label: item.name,
          value: item.code
        };
      });
      return selectOption;
    },
    /** 重置路由的store */
    resetDictStore() {
      this.$reset();
    }
  }
});
