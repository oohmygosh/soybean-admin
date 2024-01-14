/** 请求服务的环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>;

/** 不同请求服务的环境配置 */
const serviceEnv: ServiceEnv = {
  dev: {
    url: 'http://127.0.0.1:9999',
    auth: '/auth',
    gen: '/gem',
    sys: '/res'
  },
  test: {
    url: 'https://mock.apifox.com/m1/',
    auth: '/3537680-0-73c00156',
    gen: '/3537680-0-73c00156',
    sys: '/3537680-0-a0181096'
  },
  prod: {
    url: 'http://127.0.0.1:9999',
    auth: '/auth',
    gen: '/gen',
    sys: '/res'
  }
};

export const ServicePrefix = {
  'maker-service-authorization': '/auth',
  'maker-service-generator': '/gen',
  'maker-service-resource-biz': '/res'
};

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ImportMetaEnv): ServiceEnvConfigWithProxyPattern {
  const { VITE_SERVICE_ENV = 'dev' } = env;

  const config = serviceEnv[VITE_SERVICE_ENV];

  return {
    ...config,
    proxyPattern: '/api'
  };
}
