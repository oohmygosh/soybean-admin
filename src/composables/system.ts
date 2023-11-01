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
    const { userRole } = auth.userInfo;

    let has = userRole.includes('super');
    if (!has) {
      if (isArray(permission)) {
        has = permission.some(item => userRole.includes(item));
      }
      if (isString(permission)) {
        has = userRole.includes(permission);
      }
    }
    return has;
  }

  return {
    hasPermission
  };
}
