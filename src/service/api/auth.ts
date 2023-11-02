import { mockRequest, request } from '../request';

const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * 获取验证码
 * @param phone - 手机号
 * @returns - 返回boolean值表示是否发送成功
 */
export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', { phone });
}

/**
 * 登录
 * @param username - 用户名
 * @param password - 密码
 */
export function fetchLogin(username: string, password: string) {
  const client = window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT);
  const basicAuth = `Basic ${client}`;
  request
    .post<ApiAuth.Token>(
      '/oauth2/token',
      {
        username,
        password,
        grant_type: 'password',
        scope: 'message.read'
      },
      {
        headers: {
          Authorization: basicAuth,
          'Content-Type': FORM_CONTENT_TYPE
        }
      }
    )
    .then(result => {
      console.log(result);
    });
  return mockRequest.post<ApiAuth.Token>('/login', { username, password });
}

/** 获取用户信息 */
export function fetchUserInfo() {
  return mockRequest.get<ApiAuth.UserInfo>('/getUserInfo');
}

/**
 * 获取用户路由数据
 * @param userId - 用户id
 * @description 后端根据用户id查询到对应的角色类型，并将路由筛选出对应角色的路由数据返回前端
 */
export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', { userId });
}

/**
 * 刷新token
 * @param refreshToken
 */
export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', { refreshToken });
}
