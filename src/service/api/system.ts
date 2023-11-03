import { request } from '@/service/request';
import { apiPrefix } from '~/.env-config';

class BaseApi {
  protected baseUri = '';
}

class SysUserApi extends BaseApi {
  protected baseUri = `${apiPrefix.sys}/user`;

  // eslint-disable-next-line no-useless-constructor
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
