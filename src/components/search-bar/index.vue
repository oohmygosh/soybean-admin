<template>
  <div class="mb-5">
    <n-form ref="formRef" v-bind="$props">
      <n-flex justify="center" class="w-full">
        <n-form-item v-for="column in columns" :key="column.key" :label="String(column.title)">
          <component :is="defaultFormItem(column)" />
        </n-form-item>
        <n-button type="info" @click="search">搜索</n-button>
        <n-button @click="resetCondition">重置</n-button>
      </n-flex>
    </n-form>
  </div>
</template>

<script setup lang="tsx">
import { toRefs } from 'vue';
import type { TableBaseColumn } from 'naive-ui/es/data-table/src/interface';
import { useDictStore } from '~/src/store';
import type { SearchBarProps } from './src/types/props';

const props = withDefaults(defineProps<SearchBarProps>(), {
  columns: () => [],
  size: 'medium',
  inline: true,
  labelPlacement: 'left',
  showLabel: true,
  labelWidth: 80
});
const dict = useDictStore();
const { columns, modelValue } = toRefs(props);
type Emits = {
  (e: 'search'): void;
};
const emits = defineEmits<Emits>();
const search = () => {
  emits('search');
};

const resetCondition = () => {
  columns.value.forEach(element => {
    modelValue.value[element.key] = null;
  });
};

const defaultFormItem = (column: TableBaseColumn) => {
  if (column.key === 'status') {
    return (
      <n-select
        class="w-200px"
        v-model:value={modelValue.value[column.key]}
        options={dict.getSelect('COMMON_STATUS').options}
        clearable
        placeholder={`请选择${column.title}`}
      ></n-select>
    );
  }
  if (column.render) return column.render(modelValue.value, 0);
  return <n-input placeholder={`请输入${column.title}`} v-model:value={modelValue.value[column.key]} clearable />;
};
</script>
