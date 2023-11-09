import type { AxiosRequestConfig } from 'axios';
import { BaseApi, request } from '@/service/request';
import { getServiceEnvConfig } from '~/.env-config';

class SysUserApi extends BaseApi<ApiUserManagement.SysUser> {
  protected baseUri = `${getServiceEnvConfig(import.meta.env).sys}/user`;

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

  roleIds = (id?: number | string, config?: AxiosRequestConfig<any>) =>
    request.post<number[]>(`${this.baseUri}/role-ids?id=${id}`, {}, config);
}

export const userApi = SysUserApi.getInstance();
