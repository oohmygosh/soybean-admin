<template>
  <div>
    <template v-if="renderLocalIcon">
      <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
        <use :xlink:href="symbolId" fill="currentColor" />
      </svg>
    </template>
    <template v-else>
      <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'SvgIcon' });

/**
 * 图标组件
 * - 支持iconify和本地svg图标
 * - 同时传递了icon和localIcon，localIcon会优先渲染
 */
interface Props {
  /** 图标名称 */
  icon?: string;
  /** 本地svg的文件名 */
  localIcon?: string;
}

const props = defineProps<Props>();

const attrs = useAttrs();

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}));

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;

  const defaultLocalIcon = 'no-icon';
  let icon = props.localIcon || defaultLocalIcon;
  if (props?.icon?.startsWith('local-')) {
    icon = props.icon.replace('local-', '');
  }
  return `#${prefix}-${icon}`;
});

/** 渲染本地icon */
const renderLocalIcon = computed(() => props?.icon?.startsWith('local-') || props.localIcon || !props.icon);
</script>

<style scoped></style>
