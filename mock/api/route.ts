import type { MockMethod } from 'vite-plugin-mock';
import { routeModel, userModel } from '../model';

const apis: MockMethod[] = [
  {
    url: '/mock/getUserRoutes',
    method: 'post',
    response: (options: Service.MockOption): Service.MockServiceResult => {
      const { userId = undefined } = options.body;

      const routeHomeName: AuthRoute.LastDegreeRouteKey = 'dashboard_analysis';

      const roles = userModel.find(item => item.id === userId)?.roles || ['user'];

      const filterRoutes: AuthRoute.Route[] = [];

      roles.forEach(role => filterRoutes.push(...routeModel[role]));

      return {
        code: 200,
        message: 'ok',
        data: {
          routes: filterRoutes,
          home: routeHomeName
        }
      };
    }
  }
];

export default apis;
