// @ts-check
/** @type {import('unplugin-vue-macros').Options} */
export default {
  setupBlock: true,

  defineOptions: true,
  defineSlots: true,
  hoistStatic: true,
  shortEmits: true,
  shortBind: true,

  namedTemplate: false,
  setupSFC: true,
  booleanProp: true,

  exportProps: {
    include: [/export-props.*\.vue$/]
  },
  exportExpose: {
    include: [/export-expose.*\.vue$/]
  },
  exportRender: {
    include: [/export-render.*\.vue$/]
  }
};
