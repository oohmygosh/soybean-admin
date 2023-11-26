<template>
  <n-layout has-sider>
    <n-layout-sider content-style="padding: 24px;" :native-scrollbar="false">
      <router-tree @tree-click="treeClick" />
    </n-layout-sider>
    <n-layout-content :style="!resource?.id ? 'margin: auto' : ''">
      <n-empty v-if="!resource?.id" description="请点击左侧菜单" />
      <router-content v-else :data="resource" class="ml" />
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import type { TreeOption } from 'naive-ui';
import RouterTree from '@/views/management/route/components/router-tree.vue';
import RouterContent from '@/views/management/route/components/router-content.vue';

let resource = $ref({}) as TreeOption & ResourceManager.Resource;

const treeClick = (node: TreeOption & ResourceManager.Resource) => {
  resource = node;
  window.$message?.success(`click: ${node.title}`);
};
</script>

<style scoped></style>
