<template>
  <div style="h-full">
    <n-input v-model:value="pattern" placeholder="请输入字典名或编码" />
    <n-space vertical :size="14">
      <n-spin :show="show">
        <n-tree
          ref="routerRef"
          block-line
          :data="treeData"
          :show-irrelevant-nodes="false"
          draggable
          :pattern="pattern"
          cascade
          :filter="treeFilter"
          :node-props="nodeProps"
          :render-suffix="renderSuffix"
          @drop="handleDrop"
          @update:checked-keys="ids => (checkedKeys = ids)"
        />
      </n-spin>
    </n-space>
    <n-layout-footer bordered position="absolute">
      <n-button strong secondary type="primary" class="w-full" @click="addRootNode">
        <template #icon>
          <icon-ic-round-plus />
        </template>
      </n-button>
    </n-layout-footer>
    <save-modal v-model:visible="visible" :type="modalType" :edit-data="editData" @update:action="getData" />
  </div>
</template>

<script setup lang="tsx">
import { onMounted } from 'vue';
import { NButton, NTree } from 'naive-ui';
import type { TreeDropInfo, TreeOption, TreeOptions } from 'naive-ui/es/tree/src/interface';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import { dictApi } from '@/service';
import { useBoolean } from '~/src/hooks';
import type { ModalType } from './save-modal.vue';
import SaveModal from './save-modal.vue';

const { bool: show, setTrue: startLoading, setFalse: stopLoading } = useBoolean(true);
const { bool: visible, setTrue: openModal } = useBoolean();
let modalType = $ref<ModalType>('add');
const pattern = $ref('');
const checkedKeys: number[] = $ref([]);
let treeData = $ref([]) as TreeOptions & ApiDictManagement.SysDict[];
let editData = $ref<ApiDictManagement.SysDict>({});
const routerRef = $ref() as InstanceType<typeof NTree>;
type Emits = {
  (e: 'tree-click', param: (typeof treeData)[0]): void;
};
const emit = defineEmits<Emits>();
const nodeProps = ({ option }: { option: TreeOption }) => {
  // noinspection JSUnusedGlobalSymbols
  return {
    async onClick() {
      emit('tree-click', option as (typeof treeData)[0]);
    }
  };
};

const getData = async () => {
  startLoading();
  const { data } = await dictApi.listParentTree();
  if (data) treeData = data;
  stopLoading();
};

const delItems = (keys: Key[]) => {
  dictApi.delete(keys).then(({ error }) => {
    if (!error) {
      window.$message?.success('删除成功');
      getData();
    }
  });
};

const addRootNode = async () => {
  editData.id = '0';
  setModalType('add');
  openModal();
};

const findSiblingsAndIndex = (node: TreeOption, nodes?: TreeOption[]): [TreeOption[], number] | [null, null] => {
  if (!nodes) return [null, null];
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i];
    if (siblingNode.id === node.id) return [nodes, i];
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children);
    if (siblings && index !== null) return [siblings, index];
  }
  return [null, null];
};

const handleDrop = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode, treeData);
  if (dragNodeSiblings === null || dragNodeIndex === null) return;
  let siblings: TreeOption[] = [];
  dragNodeSiblings.splice(dragNodeIndex, 1);
  if (dropPosition === 'inside') {
    if (node.children) {
      node.children.unshift(dragNode);
    } else {
      node.children = [dragNode];
    }
    const sort = (node.children[dragNodeIndex + 1]?.sort ?? 0) as number;
    dragNode.sort = sort - 1;
    return;
  } else if (dropPosition === 'before') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex, 0, dragNode);
    siblings = nodeSiblings;
  } else if (dropPosition === 'after') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
    siblings = nodeSiblings;
  }
  siblings?.forEach((item, index) => (item.sort = index));
  if (siblings)
    dictApi.sort(siblings as typeof treeData).then(({ error: e }) => {
      if (!e) window.$message?.success('保存成功');
      else getData();
    });
};

const treeFilter = (keyword: string, node: TreeOption) => {
  const data = node as (typeof treeData)[0];
  return Boolean(data?.name?.includes(keyword)) || Boolean(data?.code?.includes(keyword));
};
function setModalType(type: ModalType) {
  modalType = type;
}
const renderSuffix = ({ option }: { option: TreeOption }) => {
  const data = option as (typeof treeData)[0];
  return (
    <n-space>
      <n-button
        text
        size={'small'}
        class="do pr5"
        onClick={(ev: Event) => {
          ev.stopPropagation();
          editData = data;
          setModalType('edit');
          openModal();
        }}
      >
        {{ icon: () => <icon-mdi-credit-card-edit-outline /> }}
      </n-button>
      <n-popconfirm
        onPositive-click={(ev: Event) => {
          ev.stopPropagation();
          if (data.key) delItems([data.key]);
        }}
      >
        {{
          trigger: () => (
            <n-button text type="error" size={'small'} class="do">
              {{ icon: () => <icon-ic-round-delete /> }}
            </n-button>
          ),
          default: () => '确定删除吗？'
        }}
      </n-popconfirm>
      <span class="unDo">{data.code}</span>
    </n-space>
  );
};

onMounted(() => {
  getData();
});
</script>

<style>
.n-tree-node-content .do {
  display: none;
}
.n-tree-node-content:hover .do {
  display: block;
}
.unDo {
  opacity: 0.5; /* 设置透明度 */
}
.n-tree-node-content:hover .unDo {
  display: none;
}
</style>
