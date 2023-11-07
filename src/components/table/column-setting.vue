<template>
  <n-popover placement="bottom" trigger="click">
    <div class="setting-column">
      <div class="setting-column__title">
        <span class="move_b"></span>
        <span class="width_b">宽度</span>
        <span class="show_b">显示</span>
      </div>
    </div>
    <template #trigger>
      <n-button quaternary circle size="large" type="primary">
        <template #icon>
          <icon-ant-design-setting-outlined />
        </template>
      </n-button>
    </template>
    <div>
      <vue-draggable v-model="list" item-key="key">
        <template #item="{ element }">
          <div v-if="element.key" class="flex-y-center h-36px px-12px hover:bg-primary_active">
            <icon-mdi-drag class="mr-8px text-20px cursor-move w-30px" />
            <n-checkbox v-model:checked="element.resizable" class="mr-8px" />
            <n-switch v-model:value="element.checked" class="mr-10px w-100px">
              <template #checked>
                <n-ellipsis class="w-60px">{{ element.title }}</n-ellipsis>
              </template>
              <template #unchecked>{{ element.title }}</template>
              <template #checked-icon>😏</template>
              <template #unchecked-icon>😣</template>
            </n-switch>
          </div>
        </template>
      </vue-draggable>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DataTableColumn } from 'naive-ui';
import VueDraggable from 'vuedraggable';

type Column = DataTableColumn<any>;

interface Props {
  columns: Column[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:columns', columns: Column[]): void;
}

const emit = defineEmits<Emits>();

type List = Column & { checked?: boolean };

const list = ref(initList());

function initList(): List[] {
  return props.columns.map(item => ({ ...item, checked: true }));
}

watch(
  list,
  newValue => {
    const newColumns = newValue.filter(item => item.checked);

    const columns: Column[] = newColumns.map(item => {
      const column = { ...item };
      delete column.checked;

      return column;
    }) as Column[];

    emit('update:columns', columns);
  },
  { deep: true }
);
</script>

<style scoped>
.setting-column {
}
.setting-column__title {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}
.setting-column__title span {
  display: inline-block;
  font-weight: bold;
  color: #909399;
  font-size: 13px;
}
.setting-column__title span.move_b {
  width: 30px;
  margin-right: 15px;
}
.setting-column__title span.width_b {
  width: 60px;
  margin-right: 1 0px;
}

.setting-column__list {
  max-height: 314px;
  overflow: auto;
}
.setting-column__list li {
  list-style: none;
  margin: 10px 0;
  display: flex;
  align-items: center;
}
.setting-column__list li > span {
  display: inline-block;
  font-size: 12px;
}
.setting-column__list li span.move_b {
  width: 30px;
  margin-right: 15px;
}
.setting-column__list li span.show_b {
  width: 60px;
}
.setting-column__list li span.name_b {
  width: 140px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: default;
}
.setting-column__list li span.width_b {
  width: 60px;
  margin-right: 15px;
}
.setting-column__list li span.sortable_b {
  width: 60px;
}
.setting-column__list li span.fixed_b {
  width: 60px;
}
.setting-column__list li.ghost {
  opacity: 0.3;
}

.setting-column__bottom {
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
  text-align: right;
}

.dark .setting-column__title {
  border-color: var(--el-border-color-light);
}
.dark .setting-column__bottom {
  border-color: var(--el-border-color-light);
}
</style>
