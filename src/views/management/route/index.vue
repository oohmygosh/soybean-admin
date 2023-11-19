<template>
  <n-layout has-sider>
    <router-tree @tree-click="treeClick" />
    <router-content :data="resource" class="ml" />
  </n-layout>
</template>

<script setup lang="ts">
import type { TreeOption } from 'naive-ui';
import RouterTree from '@/views/management/route/components/router-tree.vue';
import RouterContent from '@/views/management/route/components/router-content.vue';

let resource: Partial<TreeOption & ApiResourceManager.SysResource> = $ref({});

const treeClick = (node: TreeOption & ApiResourceManager.SysResource) => {
  resource = node;
  window.$message?.success(`click: ${node.title}`);
};
</script>

<style scoped></style>
