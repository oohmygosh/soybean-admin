<template>
  <div class="h-full">
    <n-layout has-sider embedded class="h-full">
      <n-layout-content class="h-full">
        <n-card :bordered="false" class="w-full h-full">
          <h1 class="font-size-5 mb-5">{{ form.title }}</h1>
          <n-form ref="formRef" label-placement="left" label-width="auto" :model="form">
            <n-form-item label="显示名称" path="title">
              <n-input v-model:value="form.title" clearable></n-input>
            </n-form-item>
            <n-form-item v-if="form.pid != 0" label="上级菜单" path="parentName">
              <n-input v-model:value="form.parentName" clearable></n-input>
            </n-form-item>
            <n-form-item label="类型" path="type">
              <n-radio-group v-model:value="form.type" :default-value="form.type">
                <n-radio-button
                  v-for="node in radioOptions"
                  :key="node.value"
                  :value="node.value"
                  :label="node.label"
                  default-checked
                  checked
                />
              </n-radio-group>
            </n-form-item>
            <n-form-item label="icon" path="icon">
              <icon-select v-model:value="form.icon" />
            </n-form-item>
            <n-form-item label="组件名" path="name">
              <n-input v-model:value="form.name" clearable></n-input>
            </n-form-item>
            <n-form-item label="路由地址" path="path">
              <n-input-group>
                <n-input-group-label>views</n-input-group-label>
                <n-input v-model:value="form.path" :disabled="form.type !== 0" clearable />
              </n-input-group>
            </n-form-item>
            <n-form-item label="排序" path="sort">
              <n-input-number v-model:value="form.sort" button-placement="both" style="text-align: center" />
            </n-form-item>
            <n-form-item label="元数据" path="meta">
              <n-checkbox v-model:checked="form.meta.hide" size="small" label="隐藏菜单" />
              <n-checkbox v-model:checked="form.meta.keepAlive" size="small" label="缓存页面" />
              <n-checkbox v-model:checked="form.meta.multiTab" size="small" label="多Tab" />
              <n-checkbox v-model:checked="form.meta.affix" size="small" label="固定" />
            </n-form-item>
            <n-button round type="primary">保存</n-button>
          </n-form>
        </n-card>
      </n-layout-content>
      <n-layout-sider content-style="padding: 24px;" :width="'30%'">
        <h1 class="font-size-5 mb-5">接口权限</h1>
        <form-table />
      </n-layout-sider>
    </n-layout>
  </div>
</template>
<script setup lang="tsx">
import { menuTypeLabels } from '@/constants';

interface Props {
  /** 异常类型 403 404 500 */
  data: ResourceManager.Resource;
}
const { data: form } = definePropsRefs<Props>();

const radioOptions = Object.entries(menuTypeLabels).map(([key, value]) => ({
  value: Number(key),
  label: value
}));
</script>
<style scoped></style>
