<template>
  <div class="overflow-hidden">
    <n-card title="用户管理" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="flex-col h-full">
        <n-space class="pb-12px" justify="space-between">
          <n-space>
            <n-button strong secondary size="medium" circle type="primary" @click="handleAddTable">
              <template #icon>
                <icon-ic-round-plus />
              </template>
            </n-button>
            <n-button strong secondary size="medium" circle type="error">
              <template #icon>
                <icon-ic-round-delete />
              </template>
            </n-button>
            <n-button strong secondary size="medium" circle type="success">
              <template #icon>
                <icon-uil-export />
              </template>
            </n-button>
          </n-space>
          <n-space align="center" :size="18">
            <n-button quaternary size="large" circle type="primary" @click="getTableData">
              <template #icon>
                <icon-mdi-refresh :class="{ 'animate-spin': loading }" />
              </template>
            </n-button>
            <column-setting v-model:columns="columns" />
          </n-space>
        </n-space>
        <n-data-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import type { Ref } from 'vue';
import { nextTick, onMounted, reactive, ref } from 'vue';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import { userStatusLabels } from '@/constants';
import { userApi } from '@/service';
import { useBoolean, useLoading } from '@/hooks';
import type { ModalType } from './components/table-action-modal.vue';
import TableActionModal from './components/table-action-modal.vue';
import ColumnSetting from './components/column-setting.vue';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 1,
  showSizePicker: true,
  pageSizes: [1, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
  prefix({ itemCount }) {
    return `Total is ${itemCount}.`;
  }
});

onMounted(() => {
  init();
});

const tableData = ref<UserManagement.User[]>([]);

function setTableData(data: UserManagement.User[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await userApi.page({
    page: pagination.page,
    pageSize: pagination.pageSize
  });
  if (data) {
    await nextTick(() => {
      setTableData(data.records as UserManagement.User[]);
      pagination.page = data.current;
      pagination.pageCount = data.total;
      endLoading();
    });
  }
}

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
    sorter: 'default',
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
      if (row.status) {
        const tagTypes: Record<UserManagement.UserStatusKey, NaiveUI.ThemeColor> = {
          '1': 'success',
          '2': 'error',
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
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton strong secondary size={'small'} onClick={() => handleEditTable(row.id)}>
            {{ icon: () => <icon-mdi-credit-card-edit-outline /> }}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
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

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

function handleDeleteTable(rowId: string) {
  window.$message?.info(`点击了删除，rowId为${rowId}`);
}

function init() {
  getTableData();
}
</script>

<style scoped></style>
