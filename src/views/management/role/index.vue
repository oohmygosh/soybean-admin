<template>
  <div class="overflow-y-auto">
    <n-card title="角色管理" :bordered="false" class="h-full rounded-r-8px shadow-sm">
      <s-table ref="tableRef" :columns="columns" :api="roleApi.page">
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
                :disabled="(tableRef?.getChecked() ?? [])?.length <= 0"
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
          <n-button
            strong
            secondary
            round
            :disabled="tableRef?.getChecked()?.length !== 1"
            type="success"
            @click="handlerPermission"
          >
            权限设置
          </n-button>
        </template>
      </s-table>
    </n-card>
    <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
    <permission
      ref="permissionRef"
      v-model:visible="permissionVisible"
      :role-id="curRoleId"
      :default-checked-keys="defaultCheckedKeys"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { $ref } from 'vue/macros';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import { roleApi } from '@/service';
import { execApi, useBoolean } from '@/hooks';
import type { STableElementType } from '@/components/table';
import { useDictStore } from '~/src/store';
import Permission from './components/permission.vue';
import type { ModalType } from './components/table-action-modal.vue';
import TableActionModal from './components/table-action-modal.vue';

const tableRef = $ref<STableElementType>();
const permissionRef = $ref<InstanceType<typeof Permission>>();
const { bool: visible, setTrue: openModal } = useBoolean();
const { bool: permissionVisible, setTrue: openPermissionModal } = useBoolean();
let curRoleId = $ref() as Key;
let defaultCheckedKeys = $ref([]) as Key[];

const modalType = ref<ModalType>('add');
let editData = $ref<RoleManager.Role | null>(null);
function setModalType(type: ModalType) {
  modalType.value = type;
}
const dictStore = useDictStore();
async function handleDeleteTable(rowId: DataTableRowKey[] = []) {
  if (rowId.length === 0) return;
  const { error } = await execApi(roleApi.delete, { data: rowId, msg: '删除成功!' });
  if (!error) tableRef?.LoadData();
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

const handlerPermission = async () => {
  curRoleId = tableRef?.getChecked()[0] as number;
  const { data } = await roleApi.fetchRoleIds(curRoleId);
  defaultCheckedKeys = data ?? [];
  openPermissionModal();
};

async function handleEditTable(row?: RoleManager.Role) {
  if (!row) return;
  editData = row;
  setModalType('edit');
  openModal();
}

const createColumns = (): DataTableColumns<RoleManager.Role> => {
  return [
    {
      type: 'selection'
    },
    {
      title: '序号',
      key: 'index',
      align: 'center'
    },
    {
      title: '角色名称',
      key: 'name',
      align: 'center'
    },
    {
      title: '状态',
      key: 'status',
      render: row => {
        if (row.status !== undefined) {
          const status = dictStore.getDict('COMMON_STATUS').values[row.status];
          return <NTag type={status.content as NaiveUI.ThemeColor}>{status.name}</NTag>;
        }
        return <span></span>;
      },
      align: 'center'
    },
    {
      title: '别名',
      key: 'alias',
      align: 'center'
    },
    {
      title: '备注',
      key: 'remark',
      align: 'center'
    },
    {
      title: '排序',
      key: 'sort',
      align: 'center'
    },
    {
      title: '修改人',
      key: 'updateBy',
      align: 'center'
    },
    {
      title: '修改时间',
      key: 'updateTime',
      align: 'center'
    },
    {
      title: '创建人',
      key: 'createBy',
      align: 'center'
    },
    {
      title: '创建时间',
      key: 'createTime',
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
  ];
};

const columns = createColumns();
</script>
<style scoped></style>
