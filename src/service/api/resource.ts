import type { TreeOption } from 'naive-ui';
import type { Key } from 'naive-ui/es/cascader/src/interface';
import { BaseApi, request } from '@/service/request';
import type { ServicePrefix } from '~/.env-config';
import { getServiceEnvConfig } from '~/.env-config';
import { adapter } from '~/src/utils';
import { adapterOfFillKey } from './management.adapter';

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
  public fetchUserRoutes() {
    return request.get<AuthRoute.Route[]>(`${this.baseUri}/list-menu-permissions`);
  }

  /**
   * 获取Api列表
   *
   * @param id 资源Id
   * @returns Api列表
   */
  public fetchApiByResourceId(id: Key) {
    return request.get<ApiResourceManager.ResourceApi[]>(`${this.baseUri}/list-api?id=${id}`);
  }

  /**
   * 获取所有已注册的后台服务
   *
   * @returns 服务的名称
   */
  public fetchAllService() {
    return request.get<(keyof typeof ServicePrefix)[]>(`${this.baseUri}/fetch_server`);
  }

  /**
   * 排序
   *
   */
  public sort(resourceList: ApiResourceManager.SysResource[]) {
    return request.post<boolean>(`${this.baseUri}/sort`, resourceList);
  }

  /**
   * 获取所有已注册的后台服务的Api列表
   *
   * @returns Api列表
   */
  public async fetchServiceApiPermissions(uri?: string) {
    return adapter(
      adapterOfFillKey,
      await request.get<(ApiResourceManager.ApiDoc & TreeOption)[]>(`${uri ?? this.baseUri}/fetch_all_api`)
    ) as Service.RequestResult<(ApiResourceManager.ApiDoc & TreeOption)[]>;
  }
}

export const resourceApi = SysResourceApi.getInstance();
