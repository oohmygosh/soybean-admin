<template>
  <div>
    <n-card :bordered="false" class="h-full">
      <n-flex>
        <n-card
          v-for="item in [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
          ]"
          :key="item"
          title="Mysql"
          class="w-300px"
        >
          <ul>
            <li>
              <h4>数据库类型</h4>
              <p>111</p>
            </li>
            <li>
              <h4>数据库描述</h4>
              <p>22</p>
            </li>
          </ul>
          <template #header-extra><icon-tabler-brand-mysql class="w-30px h-30px" /></template>
          <template #footer>#action</template>
        </n-card>
      </n-flex>
      <template #footer>
        <n-flex justify="center">
          <n-pagination
            v-model:page="page"
            v-model:page-size="pageSize"
            :page-count="100"
            show-size-picker
            :page-sizes="[10, 20, 30, 40]"
          />
        </n-flex>
      </template>
    </n-card>
  </div>
</template>
<script setup lang="tsx">
const page = $ref(10);
const pageSize = $ref(20);
</script>
