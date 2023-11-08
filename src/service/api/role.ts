import { BaseApi } from '@/service/request';
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
}

export const roleApi = RoleApi.getInstance();
