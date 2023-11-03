import { localStg } from '@/utils';

/** 获取token */
export function getToken() {
  return localStg.get('accessToken') || '';
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    id: '',
    username: '',
    roles: ['user'],
    permissions: []
  };
  return localStg.get('userInfo') || emptyInfo;
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove('accessToken');
  localStg.remove('refreshToken');
  localStg.remove('userInfo');
}
