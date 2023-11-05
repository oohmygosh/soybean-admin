<script setup lang="ts">
import type { STableProps } from './types/props';

const props = withDefaults(defineProps<STableProps>(), {});
</script>

<template>
  <div>
    <div>11111{{ props }}</div>
  </div>
</template>

<style scoped></style>
