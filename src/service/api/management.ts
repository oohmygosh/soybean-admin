import { mockRequest } from '../request';

/** 获取用户列表 */
export const fetchUserList = async () => {
  const data = await mockRequest.post<ApiUserManagement.SysUser[] | null>('/getAllUserList');
  return data;
};
