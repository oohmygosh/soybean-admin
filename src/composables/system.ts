import UAParser from 'ua-parser-js';
import { useAuthStore } from '@/store';
import { isArray, isString } from '@/utils';

/** 获取设备信息 */
export function useDeviceInfo() {
  const parser = new UAParser();
  return parser.getResult();
}

/** 权限判断 */
export function usePermission() {
  const auth = useAuthStore();

  function hasPermission(permission: Auth.RoleType | Auth.RoleType[]) {
    const { roles, permissions } = auth.userInfo;
    let has = roles.includes('super');
    if (!has) {
      if (isArray(permission)) {
        has = permission.some(item => roles.includes(item)) || permission.some(item => permissions.includes(item));
      }
      if (isString(permission)) {
        has = roles.includes(permission) || permissions?.includes(permission);
      }
    }
    return has;
  }

  return {
    hasPermission
  };
}
