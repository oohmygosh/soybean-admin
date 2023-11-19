import { $t } from '@/locales';
import { transformObjectToOption } from './_shared';

export const loginModuleLabels: Record<UnionKey.LoginModule, string> = {
  'pwd-login': $t('page.login.pwdLogin.title'),
  'code-login': $t('page.login.codeLogin.title'),
  register: $t('page.login.register.title'),
  'reset-pwd': $t('page.login.resetPwd.title'),
  'bind-wechat': $t('page.login.bindWeChat.title')
};

export const userRoleLabels: Record<Auth.RoleType, string> = {
  super: $t('page.login.pwdLogin.superAdmin'),
  admin: $t('page.login.pwdLogin.admin'),
  user: $t('page.login.pwdLogin.user')
};
export const userRoleOptions = transformObjectToOption(userRoleLabels);

/** 用户性别 */
export const genderLabels: Record<UserManagement.GenderKey, string> = {
  女: '女',
  男: '男'
};
export const genderOptions = transformObjectToOption(genderLabels);

/** 用户状态 */
export const userStatusLabels: Record<UserManagement.UserStatusKey, string> = {
  0: '禁用',
  1: '启用'
};
/** 状态 */
export const statusLabels: Record<UserManagement.UserStatusKey, string> = {
  0: '禁用',
  1: '启用'
};
export const userStatusOptions = transformObjectToOption(userStatusLabels);

/** 类型 0，菜单 1，iframe 2，外链 3，按钮 */
export const menuTypeLabels: Record<ResourceManager.MenuTypeKey, string> = {
  0: '菜单',
  1: 'iframe',
  2: '外链',
  3: '按钮'
};
