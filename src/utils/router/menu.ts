import { useIconRender } from '@/composables';
import { $t } from '@/locales';

/**
 * 将权限路由转换成菜单
 * @param routes - 路由
 */
export function transformAuthRouteToMenu(routes: AuthRoute.Route[]): App.GlobalMenuOption[] {
  const globalMenu: App.GlobalMenuOption[] = [];
  routes.forEach(route => {
    const { name, meta, component } = route;
    let { path } = route;
    switch (component) {
      case 'iframe':
        path += path.includes('?') ? `&url=${meta.href}` : `?url=${meta.href}`;
        route.meta.href = undefined;
        break;
      default:
    }
    const routeName = name as string;
    let menuChildren: App.GlobalMenuOption[] | undefined;
    if (route.children && route.children.length > 0) {
      menuChildren = transformAuthRouteToMenu(route.children);
    }
    const menuItem: App.GlobalMenuOption = addPartialProps({
      menu: {
        key: routeName,
        label: meta.title,
        routeName,
        routePath: path,
        i18nTitle: meta.i18nTitle
      },
      icon: meta.icon,
      localIcon: meta.localIcon,
      children: menuChildren
    });

    if (!hideInMenu(route)) {
      globalMenu.push(menuItem);
    }
  });

  return globalMenu;
}

/**
 * 翻译菜单
 * @param menus
 * @returns
 */
export function translateMenuLabel(menus: App.GlobalMenuOption[]): App.GlobalMenuOption[] {
  const globalMenu: App.GlobalMenuOption[] = [];
  menus.forEach(menu => {
    let menuChildren: App.GlobalMenuOption[] | undefined;
    if (menu.children && menu.children.length > 0) {
      menuChildren = translateMenuLabel(menu.children);
    }
    const menuItem: App.GlobalMenuOption = {
      ...menu,
      children: menuChildren,
      label: menu.i18nTitle ? $t(menu.i18nTitle) : menu.label
    };
    globalMenu.push(menuItem);
  });
  return globalMenu;
}

/**
 * 获取当前路由所在菜单数据的paths
 * @param activeKey - 当前路由的key
 * @param menus - 菜单数据
 */
export function getActiveKeyPathsOfMenus(activeKey: string, menus: App.GlobalMenuOption[]) {
  const keys: string[] = [];
  const lists: App.GlobalMenuOption[] = [];
  function traverse(list: App.GlobalMenuOption[], parent: App.GlobalMenuOption | null = null) {
    list.forEach((t: App.GlobalMenuOption) => {
      lists.push(t);
      if (parent) {
        t.parent = parent;
      }
      if (t.children) {
        traverse(t.children, t);
      }
    });
  }
  traverse(JSON.parse(JSON.stringify(menus)));
  lists.forEach((t: App.GlobalMenuOption) => {
    if (t.routeName === activeKey) {
      let temp = t;
      while (temp) {
        keys.push(temp.routeName);
        temp = temp.parent as App.GlobalMenuOption;
      }
    }
  });
  return keys;
}

/** 路由不转换菜单 */
function hideInMenu(route: AuthRoute.Route) {
  return Boolean(route.meta.hide);
}

/** 给菜单添加可选属性 */
function addPartialProps(config: {
  menu: App.GlobalMenuOption;
  icon?: string;
  localIcon?: string;
  children?: App.GlobalMenuOption[];
}) {
  const { iconRender } = useIconRender();

  const item = { ...config.menu };

  const { icon, localIcon, children } = config;

  if (localIcon) {
    Object.assign(item, { icon: iconRender({ localIcon }) });
  }

  if (icon) {
    Object.assign(item, { icon: iconRender({ icon }) });
  }

  if (children) {
    Object.assign(item, { children });
  }
  return item;
}
