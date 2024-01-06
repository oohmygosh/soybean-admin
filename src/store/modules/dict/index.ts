import { defineStore } from 'pinia';
import { initDictStore } from './helpers';

export type DictState = {
  [key: string]: {
    name: string;
    values: Record<string, string | number>[];
  };
};

export const useDictStore = defineStore('dict-store', {
  state: (): DictState => ({}),
  actions: {
    /** 初始化字典 */
    async initRouteStore() {
      this.$state = await initDictStore();
    },
    /** 读取字典 */
    getDict(code: string) {
      return this.$state[code];
    },
    /** 重置路由的store */
    resetDictStore() {
      this.$reset();
    }
  }
});
