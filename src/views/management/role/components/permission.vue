<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-500px">
    <n-tree
      ref="treeRef"
      cascade
      show-line
      block-line
      virtual-scroll
      :data="treeData"
      checkable
      expand-on-click
      selectable
      :key-field="'id'"
      label-field="title"
      :default-checked-keys="defaultCheckedKeys"
      :render-suffix="renderSuffix"
      style="height: 300px"
    />
    <n-grid :cols="1" :x-gap="18"></n-grid>
    <n-space class="w-full pt-16px" :size="24" justify="end">
      <n-button class="w-72px" @click="closeModal">取消</n-button>
      <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
    </n-space>
  </n-modal>
</template>

<script setup lang="tsx">
import { computed, onMounted } from 'vue';
import { NTree } from 'naive-ui';
import type { TreeSelectRenderTreePart } from 'naive-ui/es/tree-select/src/interface';
import type { Key, TreeOptions } from 'naive-ui/es/tree/src/interface';
import { $ref } from 'vue/macros';
import { resourceApi, roleApi } from '@/service';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'edit';
  roleId?: Key;
  defaultCheckedKeys?: Key[];
}
const treeRef = $ref<InstanceType<typeof NTree>>();
const renderSuffix: TreeSelectRenderTreePart = info => <span>{info.option.id}</span>;

let treeData = $ref() as TreeOptions & ApiResourceManager.SysResource[];

const fetchTreeData = async () => {
  const { data } = await resourceApi.listTree();
  if (data) {
    const something = (param?: ApiResourceManager.SysResource[]) => {
      if (param) {
        param.forEach(item => {
          item.title = item.meta.title;
          something(item.children);
        });
      }
    };
    something(data);
    treeData = data;
  }
};

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'RolePermission' });

const props = withDefaults(defineProps<Props>(), {
  type: 'edit',
  editData: null,
  defaultCheckedKeys: () => [],
  roleId: undefined
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;

  (e: 'update:action'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    edit: '编辑角色视图权限'
  };
  return titles[props.type];
});

async function handleSubmit() {
  const keys = treeRef?.getCheckedData().keys;
  if (!props.roleId || !keys) return;
  const { error } = await roleApi.resourceSet({
    roleId: props.roleId,
    resourceIds: keys
  });
  if (error) return;
  window.$message?.success('保存成功!');
  emit('update:action');
  closeModal();
}

onMounted(() => {
  fetchTreeData();
});
</script>

<style scoped></style>
