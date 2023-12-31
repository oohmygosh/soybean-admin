<template>
  <div class="sf-form-table">
    <n-data-table :columns="tableColumns" :data="modelValue" />
  </div>
</template>

<script setup lang="tsx">
import { toRefs } from 'vue';
import type { DataTableColumn } from 'naive-ui';
import { NButton } from 'naive-ui';

type PropsType = {
  modelValue?: Array<any>;
  columns: Array<DataTableColumn<any>>;
};
const props = defineProps<PropsType>();
const { modelValue: data, columns } = toRefs(props);

interface Emits {
  (e: 'click'): undefined;
}
const emit = defineEmits<Emits>();
const addAction = () => {
  emit('click');
};
const tableColumns = $ref(columns) as Array<DataTableColumn<any>>;
tableColumns.unshift({
  key: 'key',
  title() {
    return (
      <NButton strong secondary type="primary" onClick={addAction}>
        {{ icon: () => <icon-ic-round-plus /> }}
      </NButton>
    );
  },
  align: 'center',
  render(_, index) {
    return (
      <div class={'sf-form-table-handle'}>
        <span>{index + 1}</span>
        <NButton
          round
          strong
          secondary
          type="error"
          size="small"
          onClick={() => {
            data?.value?.splice(index, 1);
          }}
        >
          {{ icon: () => <icon-ic-round-delete /> }}
        </NButton>
      </div>
    );
  }
});
</script>

<style>
.sf-form-table {
  width: 100%;
}

.sf-form-table .sf-form-table-handle span {
  display: inline-block;
}

.sf-form-table .sf-form-table-handle button {
  display: none;
}

.sf-form-table .n-data-table-tr:hover .sf-form-table-handle > span {
  display: none;
}

.sf-form-table .n-data-table-tr:hover .sf-form-table-handle button {
  display: inline-block;
}
</style>
