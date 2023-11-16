<template>
  <div>
    <n-card :bordered="false" class="h-full rounded-r-8px shadow-sm">
      <n-space vertical size="large">
        <n-layout has-sider>
          <n-layout-sider content-style="padding: 24px;">
            <n-space vertical :size="12">
              <n-input v-model:value="pattern" placeholder="搜索" />
              <n-tree :pattern="pattern" :data="data" block-line expand-on-click />
            </n-space>
          </n-layout-sider>
          <n-layout>
            <n-layout-header>颐和园路</n-layout-header>
            <n-layout-content content-style="padding: 24px;">平山道</n-layout-content>
            <n-layout-footer>成府路</n-layout-footer>
          </n-layout>
          <n-layout-sider content-style="padding: 24px;">海淀桥</n-layout-sider>
        </n-layout>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import type { TreeOption } from 'naive-ui/es/tree/src/interface';

const pattern = $ref('');
const data: TreeOption[] = [
  {
    label: '0',
    key: '0',
    children: [
      {
        label: '0-0',
        key: '0-0',
        children: [
          { label: '0-0-0', key: '0-0-0' },
          { label: '0-0-1', key: '0-0-1' }
        ]
      },
      {
        label: '0-1',
        key: '0-1',
        children: [
          { label: '0-1-0', key: '0-1-0' },
          { label: '0-1-1', key: '0-1-1' }
        ]
      }
    ]
  },
  {
    label: '1',
    key: '1',
    children: [
      {
        label: '1-0',
        key: '1-0',
        children: [
          { label: '1-0-0', key: '1-0-0' },
          { label: '1-0-1', key: '1-0-1' }
        ]
      },
      {
        label: '1-1',
        key: '1-1',
        children: [
          { label: '1-1-0', key: '1-1-0' },
          { label: '1-1-1', key: '1-1-1' }
        ]
      }
    ]
  }
];
</script>

<style scoped></style>
