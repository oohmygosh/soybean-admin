<template>
  <div class="overflow-y-auto">
    <n-card :bordered="false" class="h-full rounded-r-8px shadow-sm">
      <n-space vertical size="large">
        <n-layout has-sider>
          <n-layout-sider content-style="padding: 24px;" class="rounded-l-8px">
            <n-space vertical :size="12">
              <n-input v-model:value="pattern" :placeholder="$t('common.search')" />
              <n-tree
                :show-irrelevant-nodes="showIrrelevantNodes"
                :key-field="'id'"
                :pattern="pattern"
                :data="roleTree"
                block-line
                :node-props="nodeProps"
              />
            </n-space>
          </n-layout-sider>
          <n-layout-content>
            <n-card title="用户管理" :bordered="false" class="h-full rounded-r-8px shadow-sm">
              <s-table ref="tableRef" :columns="columns" :api="userApi.page">
                <template #default>
                  <n-button strong secondary size="medium" circle type="primary" @click="handleAddTable">
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
                      <icon-uil-export />
                    </template>
                  </n-button>
                </template>
              </s-table>
              <table-action-modal
                v-model:visible="visible"
                :type="modalType"
                :edit-data="editData"
                :role-options="roleTree.slice(1)"
                @update:action="() => tableRef?.LoadData()"
              />
            </n-card>
          </n-layout-content>
        </n-layout>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { DataTableColumns, DataTableRowKey, TreeOption } from 'naive-ui';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { $ref } from 'vue/macros';
import type { TreeOptions } from 'naive-ui/es/tree/src/interface';
import { userStatusLabels } from '@/constants';
import { roleApi, userApi } from '@/service';
import { execApi, useBoolean } from '@/hooks';
import TableActionModal from '@/views/management/user/components/table-action-modal.vue';
import type { STableElementType } from '~/src/components/table';
import type { ModalType } from './components/table-action-modal.vue';

const { bool: visible, setTrue: openModal } = useBoolean();

const pattern = $ref('');
const showIrrelevantNodes = $ref(false);
let roleTree: TreeOptions & ApiRoleManager.SysRole[] = $ref([]);

const tableRef = $ref<STableElementType>();
const fetchRoleTree = async () => {
  const { data } = await roleApi.listTree();
  if (data) {
    data.unshift({ id: undefined, label: '所有' });
    roleTree = data;
  }
};

fetchRoleTree();

const nodeProps = ({ option }: { option: TreeOption }) => {
  // noinspection JSUnusedGlobalSymbols
  return {
    onClick() {
      tableRef?.setParam({
        roleId: option.id
      });
      tableRef?.LoadData();
    }
  };
};

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
          <NButton strong secondary size={'small'} onClick={() => handleEditTable(row)}>
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

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

let editData = $ref<
  | (UserManagement.User & {
      roleIds?: number[] | null;
    })
  | null
>(null);

function handleAddTable() {
  openModal();
  setModalType('add');
}

async function handleEditTable(row: UserManagement.User) {
  if (row) {
    const { data: roleIds } = await userApi.roleIds(row.id);
    editData = {
      ...row,
      roleIds
    };
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: DataTableRowKey[] = []) {
  if (rowId.length === 0) return;
  const { error } = await execApi(userApi.delete, { data: rowId, msg: '删除成功!' });
  if (!error) tableRef?.LoadData();
}
</script>

<style scoped></style>
