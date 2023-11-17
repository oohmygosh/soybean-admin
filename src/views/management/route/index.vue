<template>
  <div>
    <n-card :bordered="false" class="h-full rounded-r-8px shadow-sm">
      <n-space vertical size="large">
        <n-layout has-sider>
          <n-layout-sider content-style="padding: 24px;">
            <n-space vertical :size="12">
              <n-input v-model:value="pattern" placeholder="搜索" />
              <n-tree block-line :data="data" checkable expand-on-click selectable />
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
import { repeat } from 'seemly';
import type { TreeOption } from 'naive-ui/es/tree/src/interface';

const pattern = $ref('');
function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined;
  return repeat(6 - level, undefined).map((_, index) => {
    const key = String(baseKey) + level + index;
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    };
  });
}

function createLabel(level: number): string {
  if (level === 4) return '道生一';
  if (level === 3) return '一生二';
  if (level === 2) return '二生三';
  if (level === 1) return '三生万物';
  return '';
}
const data = createData();
</script>

<style scoped></style>
