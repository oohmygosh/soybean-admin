// 图标选择器配置

const glob = import.meta.glob('../assets/svg-icon/*.svg');

const icons = [
  'mdi:emoticon',
  'mdi:ab-testing',
  'ph:alarm',
  'ph:android-logo',
  'ph:align-bottom',
  'ph:archive-box-light',
  'uil:basketball',
  'uil:brightness-plus',
  'uil:capture',
  'mdi:apps-box',
  'mdi:alert',
  'mdi:airballoon',
  'mdi:airplane-edit',
  'mdi:alpha-f-box-outline',
  'mdi:arm-flex-outline',
  'ic:baseline-10mp',
  'ic:baseline-access-time',
  'ic:baseline-brightness-4',
  'ic:baseline-brightness-5',
  'ic:baseline-credit-card',
  'ic:baseline-filter-1',
  'ic:baseline-filter-2',
  'ic:baseline-filter-3',
  'ic:baseline-filter-4',
  'ic:baseline-filter-5',
  'ic:baseline-filter-6',
  'ic:baseline-filter-7',
  'ic:baseline-filter-8',
  'ic:baseline-filter-9',
  'ic:baseline-filter-9-plus',
  'streamline-dictionary-language-book',
  'material-symbols-light:dictionary-outline-sharp'
];

export default [
  {
    name: '默认',
    icons
  },
  {
    name: '扩展',
    icons: Object.keys(glob).map(
      item =>
        `local-${item
          .split('/')
          .pop()
          ?.split('.')[0]
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()}`
    )
  }
];
