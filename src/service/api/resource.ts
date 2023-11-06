import { BaseApi, request } from '@/service/request';
import { getServiceEnvConfig } from '~/.env-config';

class SysResourceApi extends BaseApi<ApiResourceManager.SysResource> {
  protected baseUri = `${getServiceEnvConfig(import.meta.env).sys}/resource`;

  private constructor() {
    super();
  }

  private static instance: SysResourceApi;

  public static getInstance() {
    if (!SysResourceApi.instance) SysResourceApi.instance = new SysResourceApi();
    return SysResourceApi.instance;
  }

  /**
   * 获取用户路由
   */
  public async fetchUserRoutes() {
    return request.get<AuthRoute.Route[]>(`${this.baseUri}/list-menu-permissions`);
  }
}

export const resourceApi = SysResourceApi.getInstance();
