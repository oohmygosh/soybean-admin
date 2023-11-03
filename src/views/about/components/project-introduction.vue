<template>
  <n-card title="关于" :bordered="false" size="large" class="rounded-8px shadow-sm aboutTop">
    <div class="leading-24px">
      <div class="aboutTop-info">
        <n-image src="/logo-r.png" alt="" width="180" />
        <h2>{{ name }}</h2>
        <p>{{ version }}</p>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { pkgJson } from './model';

const { name, version } = pkgJson;
defineOptions({ name: 'ProjectIntroduction' });
</script>

<style scoped>
.aboutTop {
  border: 0;
  background: linear-gradient(to right, #8e54e9, #4776e6);
  color: #fff;
}

.aboutTop-info img {
  width: 100px;
}

.aboutTop-info {
  text-align: center;
}

.aboutTop-info h2 {
  font-size: 26px;
  margin-top: 15px;
}

.aboutTop-info p {
  font-size: 16px;
  margin-top: 10px;
}
</style>
