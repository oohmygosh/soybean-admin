<template>
  <n-data-table :columns="columns" :data="data" :pagination="pagination" />
</template>

<script setup lang="tsx">
import type { VNode } from 'vue';
import { h } from 'vue';
import type { DataTableColumn } from 'naive-ui';
import { NTooltip, NGradientText } from 'naive-ui';

const renderTooltip = (trigger: VNode, content: string) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content
  });
};
const pagination = {
  pageSize: 10
};
const columns: Array<DataTableColumn> = [
  {
    key: 'name',
    title() {
      return renderTooltip(
        h(
          NGradientText,
          {
            size: 24,
            type: 'danger'
          },
          { default: () => 'Name' }
        ),
        'Tooltip Content'
      );
    }
  },
  {
    key: 'age',
    title() {
      return h(
        NGradientText,
        {
          size: '20',
          type: 'info'
        },
        { default: () => 'Age' }
      );
    }
  },
  {
    key: 'address',
    title() {
      return h(
        NGradientText,
        {
          size: '16',
          type: 'warning'
        },
        { default: () => 'Address' }
      );
    }
  }
];
const data = [
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
</script>
