<template>
  <div class="overflow-hidden">
    <n-card title="用户管理" :bordered="false" class="h-full rounded-r-8px shadow-sm">
      <s-table ref="tableRef" class="flex-col" :columns="columns" :api="userApi.page">
        <template #default>
          <n-button strong secondary size="medium" circle type="primary">
            <template #icon>
              <icon-ic-round-plus />
            </template>
          </n-button>
          <n-popconfirm @positive-click="handleDeleteTable(tableRef?.getChecked())">
            <template #trigger>
              <n-button
                strong
                secondary
                :disabled="(tableRef?.getChecked() ?? []).length <= 0"
                size="medium"
                circle
                type="error"
              >
                <template #icon>
                  <icon-ic-round-delete />
                </template>
              </n-button>
            </template>
            确定删除吗？
          </n-popconfirm>
          <n-button strong secondary size="medium" circle type="success">
            <template #icon>
              <ic-twotone-download />
            </template>
          </n-button>
        </template>
      </s-table>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { $ref } from 'vue/macros';
import { userStatusLabels } from '@/constants';
import { roleApi, userApi } from '@/service';
import { execApi } from '@/hooks';
import type { STableElementType } from '~/src/components/table';

const tableRef = $ref<STableElementType>();
const fetchRoleTree = async () => {
  const { data } = await roleApi.listTree();
  if (data) {
    data.unshift({ id: undefined, label: '所有' });
  }
};

fetchRoleTree();

const columns = ref([
  {
    type: 'selection',
    align: 'center'
  },
  {
    key: 'index',
    title: '序号',
    align: 'center',
    width: 100,
    resizable: true
  },
  {
    key: 'username',
    title: '账号',
    align: 'center'
  },
  {
    key: 'userStatus',
    title: '状态',
    align: 'center',
    render: row => {
      if (row.status !== undefined) {
        const tagTypes: Record<UserManagement.UserStatusKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '0': 'error',
          '3': 'warning',
          '4': 'default'
        };

        return <NTag type={tagTypes[row.status]}>{userStatusLabels[row.status]}</NTag>;
      }
      return <span></span>;
    }
  },
  {
    key: 'avatar',
    title: '头像',
    align: 'center',
    render: row => {
      if (row.avatar) {
        return <n-avatar src={row.avatar} size="small" round />;
      }
      const firstName = !row.avatar ? String(row.realName).substring(0, 1) : '';
      return (
        <n-avatar src={row.avatar} size="small" round>
          {firstName}
        </n-avatar>
      );
    }
  },
  {
    key: 'realName',
    title: '姓名',
    align: 'center'
  },
  {
    key: 'gender',
    title: '性别',
    align: 'center',
    render: row => {
      if (row.sex) {
        return <NTag type={row.sex === '男' ? 'success' : 'warning'}>{row.sex}</NTag>;
      }
      return <span></span>;
    }
  },
  {
    key: 'updateBy',
    title: '修改人',
    align: 'center'
  },
  {
    key: 'updateTime',
    title: '修改时间',
    align: 'center'
  },
  {
    key: 'createBy',
    title: '创建人',
    align: 'center'
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    fixed: 'right',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton strong secondary size={'small'}>
            {{ icon: () => <icon-mdi-credit-card-edit-outline /> }}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable([row.id as string])}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton strong secondary type="error" size={'small'}>
                  {{ icon: () => <icon-ic-round-delete /> }}
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

async function handleDeleteTable(rowId: DataTableRowKey[] = []) {
  if (rowId.length === 0) return;
  const { error } = await execApi(userApi.delete, { data: rowId, msg: '删除成功!' });
  if (!error) tableRef?.LoadData();
}
</script>

<style scoped></style>
