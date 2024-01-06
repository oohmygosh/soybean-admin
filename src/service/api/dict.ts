import type { TreeOption } from 'naive-ui';
import { BaseApi, request } from '@/service/request';
import { getServiceEnvConfig } from '~/.env-config';
import { adapter } from '~/src/utils';
import { adapterOfConvertDictToTreeOption } from './management.adapter';

class DictApi extends BaseApi<ApiDictManagement.SysDict> {
  protected baseUri = `${getServiceEnvConfig(import.meta.env).sys}/dict`;

  private constructor() {
    super();
  }

  private static instance: DictApi;

  public static getInstance() {
    if (!DictApi.instance) DictApi.instance = new DictApi();
    return DictApi.instance;
  }

  listParent = () => request.get<ApiDictManagement.SysDict[]>(`${this.baseUri}/list-parent`);

  listParentTree = async () =>
    adapter(
      adapterOfConvertDictToTreeOption,
      await request.get<ApiDictManagement.SysDict[]>(`${this.baseUri}/list-parent`)
    ) as Service.RequestResult<(TreeOption & ApiDictManagement.SysDict)[]>;

  sort = (params: ApiDictManagement.SysDict[]) => request.post(`${this.baseUri}/sort`, params);
}

export const dictApi = DictApi.getInstance();
