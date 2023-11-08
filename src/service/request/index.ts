import type { AxiosRequestConfig } from 'axios';
import { adapter } from '@/utils';
import { adapterOfFetchPage } from '@/service/api/management.adapter';
import { getServiceEnvConfig } from '~/.env-config';
import { createRequest } from './request';

const { url, proxyPattern } = getServiceEnvConfig(import.meta.env);

const isHttpProxy = import.meta.env.VITE_HTTP_PROXY === 'Y';

export const request = createRequest({ baseURL: isHttpProxy ? proxyPattern : url });

export const mockRequest = createRequest({ baseURL: '/mock' });

/**
 * 基础Api类
 */
export class BaseApi<M extends BaseEntity> {
  protected baseUri = '';

  /**
   * 保存 or 更新
   * @param param
   * @param config
   */
  save = <T extends M>(param: T, config?: AxiosRequestConfig) => {
    return request.post<boolean | number>(
      param.id ? `${this.baseUri}/update` : `${this.baseUri}/create`,
      param,
      config
    );
  };

  /**
   * 删除
   * @param id
   * @param config
   */
  delete = (id: number[] | string[], config?: AxiosRequestConfig) => {
    return request.post<boolean>(`${this.baseUri}/delete`, id, config);
  };

  /**
   * 分页查询
   * @param param
   * @param config
   */
  page = async (param?: PageParam<M>, config?: AxiosRequestConfig) => {
    return adapter(adapterOfFetchPage, await request.post<Page<M>>(`${this.baseUri}/page`, param, config));
  };

  /**
   * 获取
   * @param id
   * @param config
   */
  get = (id: number | string, config?: AxiosRequestConfig) => request.get<M>(`${this.baseUri}/get?id=${id}`, config);

  listTree = (params?: object, config?: AxiosRequestConfig) =>
    request.post<M[]>(`${this.baseUri}/list-tree`, params, config);
}
