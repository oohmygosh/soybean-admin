<template>
  <n-form ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <n-form-item path="username">
      <n-input v-model:value="model.username" :placeholder="$t('page.login.common.usernamePlaceholder')" />
    </n-form-item>
    <n-form-item path="password">
      <n-input
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </n-form-item>
    <n-space :vertical="true" :size="24">
      <div class="flex-y-center justify-between">
        <n-checkbox v-model:checked="rememberMe">{{ $t('page.login.pwdLogin.rememberMe') }}</n-checkbox>
        <n-button :text="true" @click="toLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </n-button>
      </div>
      <n-button
        type="primary"
        size="large"
        :block="true"
        :round="true"
        :loading="auth.loginLoading"
        @click="handleSubmit"
      >
        {{ $t('page.login.common.confirm') }}
      </n-button>
      <div class="flex-y-center justify-between">
        <n-button class="flex-1" :block="true" @click="toLoginModule('code-login')">
          {{ loginModuleLabels['code-login'] }}
        </n-button>
        <div class="w-12px"></div>
        <n-button class="flex-1" :block="true" @click="toLoginModule('register')">
          {{ loginModuleLabels.register }}
        </n-button>
      </div>
    </n-space>
    <other-account @login="handleLoginOtherAccount" />
  </n-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import { loginModuleLabels } from '@/constants';
import { useAuthStore } from '@/store';
import { useRouterPush } from '@/composables';
import { formRules } from '@/utils';
import { OtherAccount } from './components';

const auth = useAuthStore();
const { login } = useAuthStore();
const { toLoginModule } = useRouterPush();

const formRef = ref<HTMLElement & FormInst>();

const model = reactive({
  username: 'admin',
  password: 'SwiftPassword1$'
});

const rules: FormRules = {
  password: formRules.pwd
};

const rememberMe = ref(false);

async function handleSubmit() {
  await formRef.value?.validate();

  const { username, password } = model;

  await login(username, password);
}

function handleLoginOtherAccount(param: { username: string; password: string }) {
  const { username, password } = param;
  login(username, password);
}
</script>

<style scoped></style>
