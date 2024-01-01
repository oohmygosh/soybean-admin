import { superAdmin } from '~/mock/api/auth';

const about: AuthRoute.Route = {
  name: 'about',
  path: '/about',
  component: 'self',
  meta: {
    title: '关于',
    i18nTitle: 'routes.about',
    requiresAuth: true,
    keepAlive: true,
    singleLayout: 'basic',
    permissions: [superAdmin, 'admin', 'user'],
    icon: 'fluent:book-information-24-regular',
    sort: 10
  }
};

export default about;
