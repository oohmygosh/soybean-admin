import { localStg } from '@/utils';
import { getServiceEnvConfig } from '~/.env-config';
import { mockRequest, request } from '../request';

const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

class AuthApi {
  baseUri = getServiceEnvConfig(import.meta.env).auth;

  basicAuth = `Basic ${window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT)}`;

  private constructor() {}

  private static instance: AuthApi;

  public static getInstance() {
    if (!AuthApi.instance) AuthApi.instance = new AuthApi();

    return AuthApi.instance;
  }

  /**
   * 登录
   * @param username - 用户名
   * @param password - 密码
   */
  public fetchLogin(username: string, password: string) {
    localStg.set('accessToken', this.basicAuth);
    return request.post<ApiAuth.Token>(
      `${this.baseUri}/oauth2/token`,
      {
        username,
        password,
        grant_type: 'password',
        scope: 'message.read'
      },
      {
        headers: {
          'Content-Type': FORM_CONTENT_TYPE
        }
      }
    );
  }

  /**
   * 刷新AccessToken
   * @param refreshToken - 刷新token
   */
  public fetchUpdateToken(refreshToken: string) {
    localStg.set('accessToken', this.basicAuth);
    return request.post<ApiAuth.Token>(
      `${this.baseUri}/oauth2/token`,
      {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      {
        headers: {
          'Content-Type': FORM_CONTENT_TYPE
        }
      }
    );
  }
}

export const authApi = AuthApi.getInstance();

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}
