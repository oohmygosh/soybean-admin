import type { AxiosRequestConfig } from 'axios';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import { BaseApi, request } from '@/service/request';
import { encryptByMD5 } from '@/utils/crypto';
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

  save = <T extends ApiUserManagement.SysUser>(param: T, config?: AxiosRequestConfig) => {
    if (!param.id) param.password = encryptByMD5(param.password);
    return request.post<boolean | number>(
      param.id ? `${this.baseUri}/update` : `${this.baseUri}/create`,
      param,
      config
    );
  };

  roleIds = (id?: Key, config?: AxiosRequestConfig<any>) =>
    request.post<number[]>(`${this.baseUri}/role-ids?id=${id}`, {}, config);

  refreshUserCache = (id?: Key[], config?: AxiosRequestConfig<any>) =>
    request.post(`${this.baseUri}/refresh-cache`, id, config);
}

export const userApi = SysUserApi.getInstance();
