import { defineStore } from 'pinia';
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
    /** 重置路由的store */
    resetDictStore() {
      this.$reset();
    }
  }
});
