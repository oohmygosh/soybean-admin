import { BaseApi, request } from '@/service/request';
import { apiPrefix } from '~/.env-config';

class SysResourceApi extends BaseApi<ApiResourceManager.SysResource> {
  protected baseUri = `${apiPrefix.sys}/resource`;

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
    // const { data, error } = await request.get<AuthRoute.Route[]>(`${this.baseUri}/list-menu-permissions`);
    return request.get<AuthRoute.Route[]>(`${this.baseUri}/list-menu-permissions`);
  }
}

export const resourceApi = SysResourceApi.getInstance();
