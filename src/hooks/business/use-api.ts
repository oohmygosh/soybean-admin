import type { AxiosRequestConfig } from 'axios';

export const execApi = async <T>(
  api: (param?: any, config?: AxiosRequestConfig) => Promise<Service.RequestResult<T>>,
  requestConfig: {
    data?: any;
    config?: AxiosRequestConfig;
    msg?: string;
  }
) => {
  const { data: param, config, msg } = requestConfig;
  const result = await api(param, config);
  !result.error && msg && window.$message?.success(msg);
  return result;
};
