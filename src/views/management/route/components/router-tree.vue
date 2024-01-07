<template>
  <div style="h-full">
    <n-input v-model:value="pattern" :placeholder="$t('common.search')" />
    <n-spin :show="show">
      <n-space vertical :size="14">
        <n-tree
          ref="routerRef"
          block-line
          :data="treeData"
          :key-field="'id'"
          :label-field="'title'"
          checkable
          draggable
          :pattern="pattern"
          expand-on-click
          selectable
          cascade
          :node-props="nodeProps"
          :render-suffix="renderSuffix"
          :render-prefix="renderPrefix"
          @drop="handleDrop"
          @update:checked-keys="ids => (checkedKeys = ids)"
        />
      </n-space>
    </n-spin>
    <n-layout-footer bordered position="absolute">
      <n-card :bordered="false" size="small">
        <n-button-group size="medium">
          <n-button strong secondary type="primary" @click="addRootMenu">
            <template #icon>
              <icon-ic-round-plus />
            </template>
          </n-button>
          <n-popconfirm @positive-click="delMenu">
            <template #trigger>
              <n-button strong secondary :disabled="checkedKeys?.length <= 0" size="medium" type="error">
                <template #icon>
                  <icon-ic-round-delete />
                </template>
              </n-button>
            </template>
            确定删除吗？
          </n-popconfirm>
        </n-button-group>
      </n-card>
    </n-layout-footer>
  </div>
</template>

<script setup lang="tsx">
import { onMounted } from 'vue';
import { NButton, NTree } from 'naive-ui';
import type { TreeDropInfo, TreeOption, TreeOptions } from 'naive-ui/es/tree/src/interface';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import { resourceApi } from '@/service';
import { useBoolean } from '~/src/hooks';

const { bool: show, setFalse, setTrue } = useBoolean();
const pattern = $ref('');
const checkedKeys: number[] = $ref([]);
let treeData = $ref([]) as TreeOptions &
  (ApiResourceManager.SysResource & { apiList?: ApiResourceManager.ResourceApi[] })[];
const routerRef = $ref() as InstanceType<typeof NTree>;
type Emits = {
  (e: 'tree-click', param: (typeof treeData)[0]): void;
};
const newMenu: (typeof treeData)[0] = {
  title: 'NewMenu',
  name: 'NewMenu',
  icon: 'local-logo',
  path: '/blank-layout',
  href: '',
  dynamicPath: '',
  i18nTitle: '',
  component: 'blank'
};
const emit = defineEmits<Emits>();
const nodeProps = ({ option }: { option: TreeOption }) => {
  // noinspection JSUnusedGlobalSymbols
  return {
    async onClick() {
      resourceApi.fetchApiByResourceId(option.id as string).then(({ data }) => {
        (option as any).apiList = data;
      });
      emit('tree-click', option as (typeof treeData)[0]);
    }
  };
};

const getData = async () => {
  setTrue();
  const { data } = await resourceApi.listTree();
  if (data) treeData = data;
  setFalse();
};

const renderPrefix = ({ option }: { option: TreeOption }) => {
  const data = option as TreeOption & ApiResourceManager.SysResource;
  return <svg-icon icon={data.icon}></svg-icon>;
};
const delMenu = () => {
  const keys = routerRef
    .getCheckedData()
    .options.filter(e => !e?.children || e?.children?.length === 0)
    .filter(e => e)
    .map(e => e?.id) as Key[];
  resourceApi.delete(keys).then(({ error }) => {
    if (!error) {
      window.$message?.success('删除成功');
      getData();
    }
  });
};

const addMenu = async (option: (typeof treeData)[0]) => {
  option.children = option.children || [];
  const menu = { ...newMenu };
  menu.sort = (option.children[0]?.sort as number) - 1;
  menu.pid = option.id;
  menu.parentName = option.title;
  const { error, data } = await resourceApi.save(menu);
  if (error) return;
  menu.id = data as string;
  option.children.unshift(menu);
  window.$message?.success(`添加成功`);
};

const addRootMenu = async () => {
  const menu = { ...newMenu };
  menu.sort = (treeData[0]?.sort as number) - 1;
  menu.pid = '0';
  const { error, data } = await resourceApi.save(menu);
  if (error) return;
  menu.id = data as string;
  treeData.unshift(menu);
  window.$message?.success(`添加成功`);
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
  const setParent = (sibling: typeof dragNode) => {
    if (dragNode.pid === sibling.pid) return;
    dragNode.pid = sibling.pid;
    dragNode.parentName = sibling.parentName;
  };
  if (dropPosition === 'inside') {
    if (node.children) {
      node.children.unshift(dragNode);
    } else {
      node.children = [dragNode];
    }
    dragNode.pid = node.id;
    dragNode.parentName = node.title;
    const sort = (node.children[dragNodeIndex + 1]?.sort ?? 0) as number;
    dragNode.sort = sort - 1;
    return;
  } else if (dropPosition === 'before') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex, 0, dragNode);
    setParent(nodeSiblings[nodeIndex]);
    siblings = nodeSiblings;
  } else if (dropPosition === 'after') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, treeData);
    if (nodeSiblings === null || nodeIndex === null) return;
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
    setParent(nodeSiblings[nodeIndex]);
    siblings = nodeSiblings;
  }
  siblings?.forEach((item, index) => (item.sort = index));
  resourceApi.save(dragNode).then(({ error }) => {
    if (!error && siblings.length > 0) {
      resourceApi.sort(siblings).then(({ error: e }) => {
        if (!e) window.$message?.success('保存成功');
        else getData();
      });
    }
  });
};

const renderSuffix = ({ option }: { option: TreeOption }) => {
  const data = option as (typeof treeData)[0];
  if (data.component !== 'multi' && data.component !== 'basic') {
    return <span></span>;
  }
  return (
    <n-button
      text
      round
      type="info"
      size="small"
      class="do"
      onClick={(ev: Event) => {
        ev.stopPropagation();
        // 其他部分添加自己的代码
        addMenu(data);
      }}
    >
      {{ icon: () => <icon-ic-round-plus /> }}
    </n-button>
  );
};

onMounted(() => {
  getData();
});
</script>

<style>
.n-tree-node-content .do {
  visibility: hidden;
}

.n-tree-node-content:hover .do {
  visibility: visible;
}
</style>
