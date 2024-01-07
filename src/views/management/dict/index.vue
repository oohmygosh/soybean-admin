<template>
  <n-layout has-sider>
    <n-layout-sider content-style="padding: 24px;" :native-scrollbar="false" :width="'25%'">
      <dict-tree @tree-click="treeClick" />
    </n-layout-sider>
    <n-layout-content>
      <n-card title="字典管理" :bordered="false" class="h-full rounded-r-8px shadow-sm">
        <div class="flex-col h-full">
          <s-table ref="tableRef" :columns="columns" :api="dictApi.page" :immediate="false">
            <template #default>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button strong secondary size="medium" circle type="primary" @click="handleAddTable">
                    <template #icon>
                      <icon-ic-round-plus />
                    </template>
                  </n-button>
                </template>
                添加
              </n-tooltip>
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
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button strong secondary size="medium" circle type="success">
                    <template #icon>
                      <icon-ic-twotone-download />
                    </template>
                  </n-button>
                </template>
                导出
              </n-tooltip>
            </template>
          </s-table>
          <save-modal
            v-model:visible="visible"
            :type="modalType"
            :edit-data="editData"
            :role-options="roleTree.slice(1)"
            @update:action="() => tableRef?.LoadData()"
          />
        </div>
      </n-card>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="tsx">
import type { Ref } from 'vue';
import { ref } from 'vue';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { TreeOptions } from 'naive-ui/es/tree/src/interface';
import { $ref } from 'vue/macros';
import { dictApi } from '@/service';
import { execApi, useBoolean } from '@/hooks';
import type { STableElementType } from '~/src/components/table';
import { useDictStore } from '~/src/store';
import DictTree from './components/dict-tree.vue';
import type { ModalType } from './components/save-modal.vue';
import SaveModal from './components/save-modal.vue';

const { bool: visible, setTrue: openModal } = useBoolean();
const roleTree: TreeOptions & ApiRoleManager.SysRole[] = $ref([]);
let pid = $ref<string>();
const tableRef = $ref<STableElementType>();
const dictStore = useDictStore();
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
    key: 'name',
    title: '名称',
    align: 'center'
  },
  {
    key: 'code',
    title: '编码',
    align: 'center'
  },
  {
    key: 'status',
    title: '状态',
    align: 'center',
    render: row => {
      if (row.status !== undefined) {
        const status = dictStore.getDict('COMMON_STATUS').values[row.status];
        return <NTag type={status.content as NaiveUI.ThemeColor}>{status.name}</NTag>;
      }
      return <span></span>;
    }
  },
  {
    key: 'sort',
    title: '排序',
    align: 'center'
  },
  {
    key: 'content',
    title: '内容',
    align: 'center'
  },
  {
    key: 'remark',
    title: '备注',
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

let editData = $ref<ApiDictManagement.SysDict>({});

function handleAddTable() {
  editData.id = pid;
  openModal();
  setModalType('add');
}
const treeClick = (node: ApiDictManagement.SysDict) => {
  pid = node.id;
  tableRef?.setParam({
    pid: node.id
  });
  tableRef?.LoadData();
};
async function handleEditTable(row: UserManagement.User) {
  if (row) {
    editData = row;
    setModalType('edit');
    openModal();
  }
}

async function handleDeleteTable(rowId: DataTableRowKey[] = []) {
  if (rowId.length === 0) return;
  const { error } = await execApi(dictApi.delete, { data: rowId, msg: '删除成功!' });
  if (!error) tableRef?.LoadData();
}
</script>

<style scoped></style>
