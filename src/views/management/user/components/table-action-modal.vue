<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-500px">
    <n-form ref="formRef" label-placement="left" label-width="auto" :model="formModel" :rules="rules">
      <n-grid :cols="1" :x-gap="18">
        <n-form-item-grid-item :span="12" label="用户名" path="username">
          <n-input
            v-model:value="formModel.username"
            :disabled="props.type !== 'add'"
            placeholder="用户名用于登录系统"
            clearable
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item v-if="props.type === 'add'" :span="12" label="登录密码" path="password">
          <n-input
            v-model:value="formModel.password"
            type="password"
            placeholder="用户名用于登录系统"
            clearable
            show-password-on="click"
          />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="昵称" path="nickName">
          <n-input v-model:value="formModel.nickName" placeholder="请输入昵称" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="姓名" path="realName">
          <n-input v-model:value="formModel.realName" placeholder="请输入完整的真实姓名" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="性别" path="gender">
          <n-radio-group v-model:value="formModel.sex">
            <n-radio v-for="item in dictStore.getDict('USER_SEX').values" :key="item.code" :value="item.name">
              {{ item.name }}
            </n-radio>
          </n-radio-group>
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="状态" path="status">
          <n-switch v-model:value="formModel.status" :checked-value="1" :unchecked-value="0" clearable />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="所属角色" path="roleIds">
          <!--suppress JSValidateTypes -->
          <n-tree-select
            multiple
            :options="roleOptions"
            :default-value="formModel?.roleIds"
            key-field="id"
            clearable
            :render-suffix="renderSuffix"
            @update:value="ids => (formModel.roleIds = ids)"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" :loading="saveLoading" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="tsx">
import { computed, ref, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import type { TreeSelectRenderTreePart } from 'naive-ui/es/tree-select/src/interface';
import type { TreeOptions } from 'naive-ui/es/tree/src/interface';
import { $ref } from 'vue/macros';
import { execApi, useBoolean } from '@/hooks';
import { createRequiredFormRule, formRules } from '@/utils';
import { userApi } from '~/src/service';
import { useDictStore } from '~/src/store';

const { bool: saveLoading, setTrue: startSaveLoading, setFalse: stopSaveLoading } = useBoolean();
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
        roleIds?: number[] | null;
      })
    | null;
  roleOptions: TreeOptions;
}
const dictStore = useDictStore();
export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
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
    add: '添加用户',
    edit: '编辑用户'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<
  UserManagement.User & {
    roleIds?: number[];
  },
  'username' | 'realName' | 'status' | 'sex' | 'nickName' | 'roleIds' | 'password' | 'id'
>;

let formModel = $ref<
  FormModel & {
    roleIds?: number[];
  }
>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  username: formRules.username,
  password: formRules.pwd,
  nickName: createRequiredFormRule('请输入别名'),
  sex: createRequiredFormRule('请选择性别'),
  realName: createRequiredFormRule('请输入真实姓名'),
  status: createRequiredFormRule('请选择用户状态'),
  roleIds: createRequiredFormRule('请选择角色'),
  id: []
};

function createDefaultFormModel(): FormModel {
  return {
    password: undefined,
    id: undefined,
    username: '',
    realName: '',
    nickName: '',
    sex: '男',
    status: 0,
    roleIds: []
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  formModel = model;
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
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
  startSaveLoading();
  await formRef.value?.validate();
  const { error } = await execApi(userApi.save, { data: { ...formModel }, msg: '执行成功!' });
  if (error) return;
  emit('update:action');
  stopSaveLoading();
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
