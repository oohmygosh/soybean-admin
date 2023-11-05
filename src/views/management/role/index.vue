<template>
  <div>角色管理</div>
  <n-data-table
    :columns="columns"
    :data="data"
    :summary="summary"
    :pagination="{
      pageSize: 10
    }"
  />
</template>

<script lang="ts" setup>
import { h } from 'vue';
import type { DataTableColumns, DataTableCreateSummary } from 'naive-ui';

type RowData = {
  key: number;
  name: string;
  age: number;
  address: string;
};

const createColumns = (): DataTableColumns<RowData> => {
  return [
    {
      type: 'selection'
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Age',
      key: 'age'
    },
    {
      title: 'Address',
      key: 'address'
    }
  ];
};

const createData = (): RowData[] => [
  {
    key: 0,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: 1,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
];

const createSummary: DataTableCreateSummary = pageData => {
  return {
    name: {
      value: h(
        'span',
        { style: { color: 'red' } },
        (pageData as RowData[]).reduce((prevValue, row) => prevValue + row.key, 0)
      ),
      colSpan: 3
    }
  };
};

const summary = createSummary;
const data = createData();
const columns = createColumns();
</script>
<style scoped></style>
