<template>
  <div class="sf-form-table">
    <n-data-table :columns="columns" :data="data" :pagination="pagination" />
  </div>
</template>

<script setup lang="tsx">
import type { VNode } from 'vue';
import { h } from 'vue';
import type { DataTableColumn } from 'naive-ui';
import { NButton, NInput, NTooltip } from 'naive-ui';

const renderTooltip = (trigger: VNode, content: string) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content
  });
};
const pagination = {
  pageSize: 10
};
const data = $ref([
  {
    key: 0,
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: 1,
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: 2,
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]);
const columns: Array<DataTableColumn<(typeof data)[0]>> = [
  {
    key: 'key',
    title() {
      return renderTooltip(
        <NButton strong secondary type="primary">
          {{ icon: () => <icon-ic-round-plus /> }}
        </NButton>,
        '添加接口权限'
      );
    },
    align: 'center',
    render(row, index) {
      return (
        <div class={'sf-form-table-handle'}>
          <span>{row.key}</span>
          <NButton
            round
            strong
            secondary
            type="error"
            size="small"
            onClick={() => {
              data.splice(index, 1);
            }}
          >
            {{ icon: () => <icon-ic-round-delete /> }}
          </NButton>
        </div>
      );
    }
  },
  {
    key: 'age',
    title() {
      return <span>权限标识</span>;
    },
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: String(row.age),
        onUpdateValue(v: string) {
          data[index].age = Number(v);
        }
      });
    }
  },
  {
    key: 'address',
    title() {
      return <span>接口URL</span>;
    },
    align: 'center',
    render(row, index) {
      return h(NInput, {
        value: row.address,
        onUpdateValue(v: string) {
          data[index].address = v;
        }
      });
    }
  }
];
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
