/** 用户相关模块 */
declare namespace Auth {
  import SysUser = ApiUserManagement.SysUser;
  type SuperAdmin = 'super';
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   */
  type RoleType = string | SuperAdmin | 'admin' | 'user';
  type PermissionType = string;

  /** 用户信息 */
  interface UserInfo {
    sysUser: SysUser;
    /** 用户角色类型 */
    roles: RoleType[];
    /** 用户权限编码 */
    permissions: PermissionType[];
  }
}

interface AdapterExt {
  /** 序号 */
  index: number;
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.SysUser, AdapterExt {}

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  type GenderKey = NonNullable<User['sex']>;

  /**
   * 用户状态
   * - 1: 启用
   * - 2: 禁用
   * - 3: 冻结
   * - 4: 软删除
   */
  type UserStatusKey = NonNullable<User['status']>;
}

declare namespace RoleManager {
  interface Role extends ApiRoleManager.SysRole, AdapterExt {}

  /**
   * 0、禁用 1、正常
   */
  type RoleStatusKey = NonNullable<Role['status']>;
}

declare namespace ResourceManager {
  interface Resource extends ApiResourceManager.SysResource {}
}

declare namespace DictManagement {
  interface Dict extends ApiDictManagement.SysDict {}

  type DictKey = 'COMMON_STATUS' | 'USER_STATUS' | 'USER_SEX';
}
