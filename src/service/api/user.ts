import { BaseApi, request } from '@/service/request';
import { apiPrefix } from '~/.env-config';

class SysUserApi extends BaseApi<ApiUserManagement.SysUser> {
  protected baseUri = `${apiPrefix.sys}/user`;

  private constructor() {
    super();
  }

  private static instance: SysUserApi;

  public static getInstance() {
    if (!SysUserApi.instance) SysUserApi.instance = new SysUserApi();
    return SysUserApi.instance;
  }

  /**
   * 获取登录用户信息
   */
  public fetchUserInfo() {
    return request.get<Auth.UserInfo>(`${this.baseUri}/getCurrentUserInfo`);
  }
}

export const userApi = SysUserApi.getInstance();
