import { nextTick, unref } from 'vue';
import { defineStore } from 'pinia';
import { router } from '@/router';
import { authApi, userApi } from '@/service';
import { useDictStore, useRouteStore } from '@/store';
import { useRouterPush } from '@/composables';
import { localStg } from '@/utils';
import { $t } from '@/locales';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken, getUserInfo } from './helpers';

interface AuthState {
  /** 用户信息 */
  userInfo: Auth.UserInfo;
  /** 用户token */
  accessToken: string;
  /** 登录的加载状态 */
  loginLoading: boolean;
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    userInfo: getUserInfo(),
    accessToken: getToken(),
    loginLoading: false
  }),
  getters: {
    /** 是否登录 */
    isLogin(state) {
      return Boolean(state.accessToken);
    }
  },
  actions: {
    /** 重置auth状态 */
    resetAuthStore() {
      const { toLogin } = useRouterPush(false);
      const { resetTabStore } = useTabStore();
      const { resetRouteStore } = useRouteStore();
      const route = unref(router.currentRoute);

      clearAuthStorage();
      this.$reset();

      if (route.meta.requiresAuth) {
        toLogin();
      }

      nextTick(() => {
        resetTabStore();
        resetRouteStore();
      }).then(r => r);
    },
    /**
     * 处理登录后成功或失败的逻辑
     * @param backendToken - 返回的token
     */
    async handleActionAfterLogin(backendToken: ApiAuth.Token) {
      const route = useRouteStore();
      const dict = useDictStore();
      const { toLoginRedirect } = useRouterPush(false);

      const loginSuccess = await this.loginByToken(backendToken);

      if (loginSuccess) {
        await route.initAuthRoute();
        await dict.initRouteStore();
        // 跳转登录后的地址
        toLoginRedirect();

        // 登录成功弹出欢迎提示
        if (route.isInitAuthRoute) {
          window.$notification?.success({
            title: $t('page.login.common.loginSuccess'),
            content: $t('page.login.common.welcomeBack', { username: this.userInfo.sysUser.username }),
            duration: 3000
          });
        }

        return;
      }

      // 不成功则重置状态
      this.resetAuthStore();
    },
    /**
     * 根据token进行登录
     * @param backendToken - 返回的token
     */
    async loginByToken(backendToken: ApiAuth.Token) {
      let successFlag = false;

      // 先把token存储到缓存中(后面接口的请求头需要token)
      const { access_token, refresh_token, token_type } = backendToken;
      localStg.set('accessToken', `${token_type} ${access_token}`);
      localStg.set('refreshToken', refresh_token);

      // 获取用户信息
      const { data } = await userApi.fetchUserInfo();
      if (data) {
        // 成功后把用户信息存储到缓存中
        localStg.set('userInfo', data);

        // 更新状态
        this.userInfo = data;
        this.accessToken = access_token;

        successFlag = true;
      }

      return successFlag;
    },
    /**
     * 登录
     * @param username - 用户名
     * @param password - 密码
     */
    async login(username: string, password: string) {
      this.loginLoading = true;
      const { data } = await authApi.fetchLogin(username, password);
      if (data) {
        await this.handleActionAfterLogin(data);
      }
      this.loginLoading = false;
    },
    /**
     * 更换用户权限(切换账号)
     * @param userRole
     */
    async updateUserRole(userRole: Auth.RoleType) {
      const { resetRouteStore, initAuthRoute } = useRouteStore();

      const accounts: Record<
        Auth.RoleType,
        {
          username: string;
          password: string;
        }
      > = {
        super: {
          username: 'Super',
          password: 'super123'
        },
        admin: {
          username: 'Admin',
          password: 'admin123'
        },
        user: {
          username: 'User01',
          password: 'user01123'
        }
      };
      const { username, password } = accounts[userRole];
      const { data } = await authApi.fetchLogin(username, password);
      if (data) {
        await this.loginByToken(data);
        resetRouteStore();
        await initAuthRoute();
      }
    }
  }
});
