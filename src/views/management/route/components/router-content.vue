<template>
  <n-layout has-sider>
    <n-empty v-if="!form?.id" description="请点击左侧菜单" style="margin: auto auto" />
    <div v-else>
      <n-layout>
        <n-layout-content>
          <n-card :bordered="false">
            <h1 class="font-size-5 mb-5">{{ form.title }}</h1>
            <n-form ref="formRef" label-placement="left" label-width="auto" :model="form">
              <n-form-item label="显示名称" path="title">
                <n-input v-model:value="form.title"></n-input>
              </n-form-item>
              <n-form-item label="上级菜单" path="name">
                <n-input v-model:value="form.parentName"></n-input>
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
              <n-form-item label="icon" path="icon"></n-form-item>
            </n-form>
          </n-card>
        </n-layout-content>
        <n-layout-footer></n-layout-footer>
      </n-layout>
      <n-layout-sider content-style="padding: 24px;">海淀桥</n-layout-sider>
    </div>
  </n-layout>
</template>
<script setup lang="tsx">
import { menuTypeLabels } from '@/constants';

interface Props {
  /** 异常类型 403 404 500 */
  data: Partial<ResourceManager.Resource>;
}
const { data: form } = definePropsRefs<Props>();
const radioOptions = Object.entries(menuTypeLabels).map(([key, value]) => ({
  value: Number(key),
  label: value
}));
</script>
<style scoped></style>
