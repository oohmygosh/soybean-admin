import type { AxiosRequestConfig } from 'axios';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import { BaseApi, request } from '@/service/request';
import { getServiceEnvConfig } from '~/.env-config';

class RoleApi extends BaseApi<ApiRoleManager.SysRole> {
  protected baseUri = `${getServiceEnvConfig(import.meta.env).sys}/role`;

  private constructor() {
    super();
  }

  private static instance: RoleApi;

  public static getInstance() {
    if (!RoleApi.instance) RoleApi.instance = new RoleApi();
    return RoleApi.instance;
  }

  fetchRoleIds = (roleId: Key, config?: AxiosRequestConfig) => {
    return request.get<number[]>(`${this.baseUri}/resource-ids?id=${roleId}`, config);
  };

  resourceSet = (param: { roleId: Key; resourceIds: Key[] }, config?: AxiosRequestConfig) => {
    return request.post<boolean>(`${this.baseUri}/resource-set`, param, config);
  };
}

export const roleApi = RoleApi.getInstance();
