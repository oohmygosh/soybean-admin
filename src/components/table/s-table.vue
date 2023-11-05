<template>
  <n-data-table
    ref="dataTableRef"
    :data="tableData"
    :loading="loading"
    flex-height
    class="flex-1-hidden"
    :pagination="paginationConf"
    :columns="columns"
    :row-key="rowKey"
  />
</template>

<script lang="ts" setup>
import { nextTick, onMounted, unref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { NDataTable } from 'naive-ui';
import type { DataTableSetupProps } from 'naive-ui/es/data-table/src/interface';
import { $ref } from 'vue/macros';
import { useLoading } from '../../hooks';
import type { STableProps } from './src/types/props';

const { loading, startLoading, endLoading } = useLoading(false);
const { api } = withDefaults(defineProps<STableProps & DataTableSetupProps>(), {
  rowKey: (rowData: { id: 'id' }) => rowData.id,
  scrollX: 1800
});
let tableData = $ref<any[]>([]);
const paginationConf: PaginationProps = $ref({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30],
  showQuickJumper: true,
  showSizePicker: true,
  prefix({ itemCount }) {
    return `Total is ${itemCount}.`;
  },
  onChange: (page: number) => {
    paginationConf.page = page;
    getTableData();
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationConf.pageSize = pageSize;
    paginationConf.page = 1;
    getTableData();
  }
});

function setTableData(data: any[]) {
  tableData = data;
}

async function getTableData() {
  if (!api) return;
  startLoading();
  const { data } = await api({
    page: paginationConf.page,
    pageSize: paginationConf.pageSize
  });
  if (data) {
    await nextTick(() => {
      setTableData(data.records);
      paginationConf.page = data.current;
      paginationConf.itemCount = data.total;
      endLoading();
    });
  }
}

const getData = () => unref(tableData);

onMounted(async () => {
  await getTableData();
});

defineExpose({
  getData,
  getTableData
});
</script>
<style scoped></style>
