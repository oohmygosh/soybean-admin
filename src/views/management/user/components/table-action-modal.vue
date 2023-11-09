<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-500px">
    <n-form ref="formRef" label-placement="left" label-width="auto" :model="formModel" :rules="rules">
      <n-grid :cols="1" :x-gap="18">
        <n-form-item-grid-item :span="12" label="用户名" path="username">
          <n-input v-model:value="formModel.username" placeholder="用户名用于登录系统" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="昵称" path="nickName">
          <n-input v-model:value="formModel.nickName" placeholder="请输入昵称" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="姓名" path="realName">
          <n-input v-model:value="formModel.realName" placeholder="请输入完整的真实姓名" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="性别" path="gender">
          <n-radio-group v-model:value="formModel.sex">
            <n-radio v-for="item in genderOptions" :key="item.value" :value="item.value">{{ item.label }}</n-radio>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="状态" path="status">
          <n-switch v-model:value="formModel.status" :checked-value="1" :unchecked-value="0" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="所属角色" path="roles">
          <n-tree-select
            multiple
            :options="editData?.roleTree"
            :default-value="editData?.roleIds"
            key-field="id"
            clearable
            :render-suffix="renderSuffix"
            @update:value="x => (formModel.roleIds = x)"
          />
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
import { computed, reactive, ref, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import type { TreeSelectRenderTreePart } from 'naive-ui/es/tree-select/src/interface';
import type { TreeOptions } from 'naive-ui/es/tree/src/interface';
import { genderOptions } from '@/constants';
import { createRequiredFormRule } from '@/utils';
import { userApi } from '~/src/service';

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
  editData?:
    | (UserManagement.User & {
        roleTree?: TreeOptions;
        roleIds?: number[] | null;
      })
    | null;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
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
    add: '添加用户',
    edit: '编辑用户'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<UserManagement.User, 'username' | 'realName' | 'status' | 'sex' | 'nickName'>;

const formModel = reactive<
  FormModel & {
    roleIds?: number[];
  }
>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  username: createRequiredFormRule('请输入用户名'),
  nickName: createRequiredFormRule('请输入年龄'),
  sex: createRequiredFormRule('请选择性别'),
  realName: createRequiredFormRule('请输入真实姓名'),
  status: createRequiredFormRule('请选择用户状态')
};

function createDefaultFormModel(): FormModel {
  return {
    username: '',
    realName: '',
    status: 0
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  await userApi.save(formModel);
  window.$message?.success('新增成功!');
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

const renderSuffix: TreeSelectRenderTreePart = info => <span>{info.option.alias}</span>;
</script>

<style scoped></style>
