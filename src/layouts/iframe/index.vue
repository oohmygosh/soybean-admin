<template>
  <div class="h-full">
    <iframe class="wh-full" :src="src"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const src = ref('/');
const route = useRoute();
onMounted(() => {
  src.value = route.query.url;
});
</script>

<style scoped></style>
