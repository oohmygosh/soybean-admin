<template>
  <div class="h-full">
    <n-layout has-sider embedded class="h-full">
      <n-layout-content :native-scrollbar="false" content-style="height: 100%">
        <n-card :bordered="false" class="h-full" style="min-height: 600px">
          <h1 class="font-size-5 mb-5">{{ form.parentName ? form.parentName + ' / ' + form.title : form.title }}</h1>
          <n-form ref="formRef" label-placement="left" label-width="80" :model="form" :rules="rules">
            <n-form-item label="显示名称" path="title">
              <n-input v-model:value="form.title" clearable></n-input>
            </n-form-item>
            <n-form-item label="路由组件" path="component">
              <n-radio-group v-model:value="form.component" :default-value="form.component">
                <n-radio-button
                  v-for="node in componentOptions"
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
                <n-input v-model:value="form.path" clearable />
              </n-input-group>
            </n-form-item>
            <n-form-item v-if="form.component === 'iframe'" label="页面链接" path="url">
              <n-input-group>
                <n-input-group-label>url</n-input-group-label>
                <n-input v-model:value="form.href" clearable />
              </n-input-group>
            </n-form-item>
            <n-form-item label="动态路由" path="dynamicPath">
              <n-input v-model:value="form.dynamicPath" />
            </n-form-item>
            <n-form-item label="i18n" path="i18nTitle">
              <n-input v-model:value="form.i18nTitle" />
            </n-form-item>
            <n-form-item label="页面布局" path="singleLayout">
              <n-select v-model:value="form.singleLayout" :options="singleLayoutOptions" clearable />
            </n-form-item>
            <n-form-item label="激活组件" path="activeMenu">
              <n-input v-model:value="form.activeMenu" placeholder="请输入组件名" />
            </n-form-item>
            <n-form-item label="排序" path="sort">
              <n-input-number v-model:value="form.sort" button-placement="both" style="text-align: center" />
            </n-form-item>
            <n-form-item label="元数据" path="meta">
              <n-checkbox v-model:checked="form.hide" size="small" label="隐藏菜单" />
              <n-checkbox v-model:checked="form.keepAlive" size="small" label="缓存页面" />
              <n-checkbox v-model:checked="form.multiTab" size="small" label="多Tab" />
              <n-checkbox v-model:checked="form.affix" size="small" label="固定" />
            </n-form-item>
          </n-form>
        </n-card>
        <n-layout-footer bordered position="absolute">
          <n-card :bordered="false" size="small">
            <n-button round type="primary" @click="saveForm">保存</n-button>
          </n-card>
        </n-layout-footer>
      </n-layout-content>

      <n-layout-sider content-style="padding: 24px;" :width="'30%'" :native-scrollbar="false">
        <h1 class="font-size-5 mb-5">接口权限</h1>
        <form-table v-model="form.apiList" :columns="apiColumns" @click="addAction" />
      </n-layout-sider>
    </n-layout>
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="权限树"
      positive-text="保存"
      negative-text="取消"
      @positive-click="submitCallback"
    >
      <n-tree
        ref="apiTree"
        block-line
        cascade
        checkable
        virtual-scroll
        style="height: 300px"
        label-field="title"
        :show-line="true"
        :selectable="false"
        :data="apiDocs"
        :expand-on-click="true"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
      />
    </n-modal>
  </div>
</template>
<script setup lang="tsx">
import { h, onMounted, toRefs } from 'vue';
import type { DataTableColumn, FormInst, FormRules, TreeOption } from 'naive-ui';
import { NInput, NTree } from 'naive-ui';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { componentLabels } from '@/constants';
import { ServicePrefix } from '~/.env-config';
import { resourceApi } from '~/src/service';
import { formRules } from '~/src/utils';

interface Props {
  data: ResourceManager.Resource & { apiList?: ApiResourceManager.ResourceApi[] };
}
const formRef = $ref<HTMLElement & FormInst>();
const props = defineProps<Props>();
const { data: form } = toRefs(props);
const apiTree = $ref<InstanceType<typeof NTree>>();
const apiDocs: (ApiResourceManager.ApiDoc & TreeOption)[] = $ref([]);
const defaultExpandedKeys: Key[] = [];
let defaultCheckedKeys: Key[] = $ref([]);
const componentOptions = Object.entries(componentLabels).map(([key, value]) => ({
  value: key,
  label: value
}));
const singleLayoutOptions: SelectMixedOption[] = [
  {
    label: 'basic',
    value: 'basic'
  },
  {
    label: 'blank',
    value: 'blank'
  }
];
const apiMap: Record<string, Key> = {};
const rules: FormRules = {
  title: {
    required: true
  },
  icon: {
    required: true
  },
  type: {
    required: true
  },
  name: {
    required: true
  },
  path: {
    required: true
  },
  component: {
    required: true
  },
  href: {
    required: true
  },
  code: formRules.code
};
let showModal = $ref(false);

const fillApiMap = (arr: ApiResourceManager.ApiDoc[]) => {
  if (!arr) return;
  arr.forEach(e => {
    fillApiMap(e.children);
    e.api?.forEach(item => (apiMap[item] = e.key));
  });
};

const addAction = () => {
  if (Object.keys(apiMap).length === 0) {
    fillApiMap(apiDocs);
  }

  defaultCheckedKeys = form.value.apiList?.map(e => {
    return apiMap[e.url as string];
  }) as Key[];
  showModal = true;
};

const submitCallback = () => {
  form.value.apiList = [];
  apiTree?.getCheckedData().options.forEach(item => {
    const e = item as unknown as ApiResourceManager.ApiDoc;
    e?.api?.forEach(
      url =>
        form.value.apiList?.push({
          code: e.permission,
          url
        })
    );
  });
};

const apiColumns: Array<DataTableColumn<ApiResourceManager.ResourceApi>> = [
  {
    key: 'code',
    title: '编码',
    align: 'center',
    render(row) {
      return h(NInput, {
        value: row.code,
        onUpdateValue(v: string) {
          row.code = v;
        }
      });
    }
  },
  {
    key: 'url',
    title: '接口URL',
    align: 'center',
    render(row) {
      return h(NInput, {
        value: row.url,
        onUpdateValue(v: string) {
          row.url = v;
        }
      });
    }
  }
];

const saveForm = () => {
  formRef?.validate(async errors => {
    if (!errors) {
      const { error } = await resourceApi.save(form.value);
      if (!error) window.$message?.success('保存成功');
    }
  });
};

/* watch(
  () => form.value.component,
  () => {
    switch (form.value.component) {
      case 'self':
        form.value.path = '/document/naive';
        break;
      case 'iframe':
        form.value.path = '/document/project-link';
        break;
      default:
        break;
    }
  }
);
 */
onMounted(async () => {
  const { data: service } = await resourceApi.fetchAllService();
  service?.forEach(async item => {
    if (ServicePrefix[item]) {
      const { data: apiDoc } = await resourceApi.fetchServiceApiPermissions(ServicePrefix[item]);
      if (apiDoc) apiDocs.push(...apiDoc);
    }
  });
});
</script>
<style scoped></style>
