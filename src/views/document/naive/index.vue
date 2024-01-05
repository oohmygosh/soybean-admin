<template>
  <div class="h-full">
    <iframe class="wh-full" :src="src"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const src = ref('https://www.naiveui.com/zh-CN/os-theme/docs/introduction');
const route = useRoute();
onMounted(() => {
  console.log(route.query.url);
});
</script>

<style scoped></style>
