import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';
import { localStg } from '@/utils';
import { authApi } from '../api';

/**
 * 刷新token
 * @param axiosConfig - token失效时的请求配置
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  const { resetAuthStore } = useAuthStore();
  const refreshToken = localStg.get('refreshToken') || '';
  const { data } = await authApi.fetchUpdateToken(refreshToken);
  if (data) {
    localStg.set('accessToken', `${data.token_type} ${data.access_token}`);
    localStg.set('refreshToken', data.refresh_token);

    const config = { ...axiosConfig };
    if (config.headers) {
      config.headers.Authorization = data.access_token;
    }
    return config;
  }

  resetAuthStore();
  return null;
}
