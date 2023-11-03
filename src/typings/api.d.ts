// 后端接口返回的数据类型

/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token和刷新token */
  interface Token {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }

  /** 返回的用户信息 */
  type UserInfo = Auth.UserInfo;
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[];
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey;
  }
}

declare interface BaseEntity {
  // 主键
  id: string;
  // 创建人
  createBy?: string;
  // 创建人Id
  createId?: string;
  // 创建时间
  createTime?: Date;
  // 修改人
  updateBy?: string;
  // 修改时间
  updateTime?: Date;
  // 删除 0、否 1、是
  deleted?: number;
}

declare namespace ApiUserManagement {
  interface User {
    /** 用户id */
    id: string;
    /** 用户名 */
    username: string | null;
    /** 用户年龄 */
    age: number | null;
    /**
     * 用户性别
     * - 0: 女
     * - 1: 男
     */
    gender: '0' | '1' | null;
    /** 用户手机号码 */
    phone: string;
    /** 用户邮箱 */
    email: string | null;
    /**
     * 用户状态
     * - 1: 启用
     * - 2: 禁用
     * - 3: 冻结
     * - 4: 软删除
     */
    userStatus: '1' | '2' | '3' | '4' | null;
  }

  interface SysUser extends BaseEntity {
    // 用户名
    username: string;
    // 密码
    password: string;
    // 真实名称
    realName: string;
    // 昵称
    nickName: string;
    // 头像
    avatar?: string;
    // 性别
    sex: string;
    // 手机号
    phone: string;
    // 手机号是否验证 0、否 1、是
    phoneVerified: number;
    // 邮箱
    email?: string;
    // 邮箱是否验证 0、否 1、是
    emailVerified: number;
    // 状态 0、禁用 1、正常
    status: number;
  }
}
