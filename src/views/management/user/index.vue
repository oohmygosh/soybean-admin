<template>
  <div class="overflow-hidden">
    <n-card :bordered="false" class="h-full rounded-r-8px shadow-sm">
      <n-layout has-sider class="h-full" content-style="height:100%">
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
        <n-layout-content content-style="height:100%">
          <n-card title="用户管理" :bordered="false" class="h-full rounded-r-8px shadow-sm">
            <s-table ref="tableRef" :columns="columns" :api="userApi.page">
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
import { roleApi, userApi } from '@/service';
import { execApi, useBoolean } from '@/hooks';
import TableActionModal from '@/views/management/user/components/table-action-modal.vue';
import type { STableElementType } from '~/src/components/table';
import { useDictStore } from '~/src/store';
import type { ModalType } from './components/table-action-modal.vue';

const { bool: visible, setTrue: openModal } = useBoolean();
const pattern = $ref('');
const showIrrelevantNodes = $ref(false);
let roleTree: TreeOptions & ApiRoleManager.SysRole[] = $ref([]);
const dictStore = useDictStore();
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
        const userStatusDict = dictStore.getDict('COMMON_STATUS');
        const status = userStatusDict.values[row.status];
        return <NTag type={status.content as NaiveUI.ThemeColor}>{status.name}</NTag>;
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
        const sex = dictStore.getDict('USER_SEX').values[row.sex];
        return <NTag type={sex.content as NaiveUI.ThemeColor}>{sex.name}</NTag>;
      }
      return <span></span>;
    }
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
