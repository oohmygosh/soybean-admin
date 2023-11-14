<template>
  <div class="h-full">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <slot></slot>
      </n-space>
      <n-space :align="'center'">
        <slot name="right">
          <n-button quaternary size="large" circle type="primary">
            <template #icon>
              <icon-mdi-refresh :class="{ 'animate-spin': loading }" @click="LoadData" />
            </template>
          </n-button>
          <column-setting v-model:columns="tableColumns" @update:columns="x => emit('update:columns', x)" />
        </slot>
      </n-space>
    </n-space>
    <n-data-table
      v-bind="$props"
      ref="dataTableRef"
      :data="$props.data ?? data"
      :loading="loading"
      :pagination="pagination"
      :row-key="rowKey ?? (row => row.id)"
      :columns="tableColumns"
      @update-checked-row-keys="handleChecked"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, unref } from 'vue';
import type { DataTableColumn, DataTableColumns, DataTableRowKey } from 'naive-ui';
import { NDataTable } from 'naive-ui';
import { $ref } from 'vue/macros';
import useHookTable from '~/src/hooks/business/use-hook-table';
import type { STableProps } from './src/types/props';

const checkedRowKeysRef = ref<DataTableRowKey[]>([]);
const { api, columns } = withDefaults(defineProps<STableProps>(), {
  scrollX: 1800,
  size: 'medium',
  tableLayout: 'auto',
  bordered: true,
  virtualScroll: false,
  remote: true,
  paginateSinglePage: true,
  bottomBordered: true,
  striped: false,
  defaultCheckedRowKeys: () => [],
  singleLine: true,
  singleColumn: false,
  defaultExpandedRowKeys: () => [],
  defaultExpandAll: false,
  stickyExpandedRows: false,
  allowCheckingNotLoaded: false,
  cascade: true,
  childrenKey: 'children',
  indent: 16,
  flexHeight: false,
  summaryPlacement: 'bottom',
  paginationBehaviorOnFilter: 'current'
});
const tableColumns = $ref(columns) as DataTableColumns<any>;
let apiParams: object = $ref({});
const { getData, loading, pagination, data, updatePagination } = useHookTable(api, {
  apiParams,
  columns: () => columns,
  transformer: response => {
    return {
      data: response.records,
      pageNum: response.current,
      pageSize: response.size,
      total: response.total
    };
  },
  apiParamsUpdater: pageParam => {
    pageParam.data = apiParams;
    return pageParam;
  },
  pagination: {
    prefix({ itemCount }) {
      return `Total is ${itemCount}.`;
    }
  }
});

function LoadData() {
  if (!api) return;
  getData().then();
}

interface Emits {
  (e: 'update:checked', rowKeys: DataTableRowKey[]): void;

  (e: 'update:columns', columns: DataTableColumn<any>[]): void;
}

const fetchData = () => unref(data);
const setParam = (obj: typeof apiParams) => {
  apiParams = obj;
  updatePagination({ ...pagination });
};
const emit = defineEmits<Emits>();
const getChecked = (): Array<DataTableRowKey> => unref(checkedRowKeysRef) ?? [];
const handleChecked = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeysRef.value = rowKeys;
  emit('update:checked', rowKeys);
  emit('update:columns', tableColumns);
};
onMounted(async () => {
  LoadData();
});
defineExpose({
  fetchData,
  LoadData,
  getChecked,
  updatePagination,
  setParam
});
</script>
<style scoped></style>
