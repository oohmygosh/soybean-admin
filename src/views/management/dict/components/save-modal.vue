<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-500px">
    <n-form ref="formRef" label-placement="left" label-width="auto" :model="formModel" :rules="rules">
      <n-grid :cols="1" :x-gap="18">
        <n-form-item-grid-item :span="12" label="名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="字典名称" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item label="编码" path="code">
          <n-input v-model:value="formModel.code" placeholder="字典编码" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="排序" path="sort">
          <n-input-number v-model:value="formModel.sort" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="状态" path="status">
          <n-switch v-model:value="formModel.status" :checked-value="1" :unchecked-value="0" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item label="备注" path="remark">
          <n-input v-model:value="formModel.remark" type="textarea" placeholder="字典备注" clearable />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { $ref } from 'vue/macros';
import { execApi } from '@/hooks';
import { createRequiredFormRule } from '@/utils';
import { dictApi } from '~/src/service';
export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData: ApiDictManagement.SysDict;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add'
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
    add: '添加字典',
    edit: '编辑字典'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<
  ApiDictManagement.SysDict,
  'id' | 'pid' | 'name' | 'code' | 'content' | 'status' | 'sort' | 'remark'
>;

let formModel = $ref<FormModel>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule('请输入名称'),
  code: createRequiredFormRule('请输入编码'),
  status: createRequiredFormRule('请选择状态'),
  sort: createRequiredFormRule('请输入排序'),
  pid: [],
  content: [],
  remark: [],
  id: []
};

function createDefaultFormModel(): FormModel {
  return {
    id: '',
    pid: '',
    name: '',
    code: '',
    content: '',
    status: 1,
    sort: 0
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  formModel = model;
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      defaultFormModel.pid = props.editData?.id;
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData as Partial<FormModel>);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  const { error } = await execApi(dictApi.save, { data: { ...formModel }, msg: '执行成功!' });
  if (error) return;
  emit('update:action');
  closeModal();
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
