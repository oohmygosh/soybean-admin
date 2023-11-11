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
                :disabled="tableRef?.getChecked()?.length <= 0"
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
    </n-card>
    <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { $ref } from 'vue/macros';
import { statusLabels } from '@/constants';
import { roleApi } from '@/service';
import { execApi, useBoolean } from '@/hooks';
import type { STableElementType } from '@/components/table';
import type { ModalType } from './components/table-action-modal.vue';
import TableActionModal from './components/table-action-modal.vue';

const tableRef = $ref<STableElementType<UserManagement.User>>();

const { bool: visible, setTrue: openModal } = useBoolean();

const modalType = ref<ModalType>('add');
const editData = $ref<RoleManager.Role | null>(null);

function setModalType(type: ModalType) {
  modalType.value = type;
}

async function handleDeleteTable(rowId: string[] = []) {
  if (rowId.length === 0) return;
  const { error } = await execApi(roleApi.delete, { data: rowId, msg: '删除成功!' });
  if (!error) tableRef?.getTableData();
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

const createColumns = (): DataTableColumns<RoleManager.Role> => {
  return [
    {
      type: 'selection'
    },
    {
      title: '角色名称',
      key: 'name'
    },
    {
      title: '状态',
      key: 'status',
      render: row => {
        if (row.status !== undefined) {
          const tagTypes: Record<RoleManager.RoleStatusKey, NaiveUI.ThemeColor> = {
            '1': 'success',
            '0': 'error'
          };
          return <NTag type={tagTypes[row.status]}>{statusLabels[row.status]}</NTag>;
        }
        return <span></span>;
      }
    },
    {
      title: '别名',
      key: 'alias'
    },
    {
      title: '备注',
      key: 'remark'
    },
    {
      title: '排序',
      key: 'sort'
    },
    {
      title: '修改人',
      key: 'updateBy'
    },
    {
      title: '修改时间',
      key: 'updateTime'
    },
    {
      title: '创建人',
      key: 'createBy'
    },
    {
      title: '创建时间',
      key: 'createTime'
    }
  ];
};

const columns = createColumns();
</script>
<style scoped></style>
