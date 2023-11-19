<template>
  <n-space vertical>
    <n-radio-group v-model:value="value" name="radiobuttongroup1">
      <n-radio-button
        v-for="song in songs"
        :key="song.value"
        :value="song.value"
        :disabled="(song.label === 'Live Forever' && disabled1) || (song.label === 'Shakermaker' && disabled2)"
        :label="song.label"
      />
    </n-radio-group>
    {{ value }}
    <n-space>
      <n-checkbox v-model:checked="disabled2" style="margin-right: 12px">禁用 Shakemaker</n-checkbox>
      <n-checkbox v-model:checked="disabled1">禁用 Live Forever</n-checkbox>
    </n-space>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    return {
      value: ref('0'),
      disabled2: ref(false),
      disabled1: ref(false),
      songs: [
        { value: '0', label: '菜单' },
        { value: '1', label: 'iframe' },
        { value: '2', label: '外链' },
        { value: '3', label: '按钮' }
      ].map(s => {
        s.value = s.value.toLowerCase();
        return s;
      })
    };
  }
});
</script>
