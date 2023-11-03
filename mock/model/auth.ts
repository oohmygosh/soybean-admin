interface UserModel extends Auth.UserInfo {
  accessToken: string;
  refreshToken: string;
  password: string;
}

export const userModel: UserModel[] = [
  {
    accessToken: '__TOKEN_SOYBEAN__',
    refreshToken: '__REFRESH_TOKEN_SOYBEAN__',
    id: '0',
    username: 'admin',
    roles: ['super'],
    password: 'SoybeanPassword1$',
    permissions: []
  },
  {
    accessToken: '__TOKEN_SUPER__',
    refreshToken: '__REFRESH_TOKEN_SUPER__',
    id: '1',
    username: 'Super',
    roles: ['super'],
    password: 'super123',
    permissions: []
  },
  {
    accessToken: '__TOKEN_ADMIN__',
    refreshToken: '__REFRESH_TOKEN_ADMIN__',
    id: '2',
    username: 'Admin',
    roles: ['admin'],
    password: 'admin123',
    permissions: []
  },
  {
    accessToken: '__TOKEN_USER01__',
    refreshToken: '__REFRESH_TOKEN_USER01__',
    id: '3',
    username: 'User01',
    roles: ['user'],
    password: 'user01123',
    permissions: []
  }
];
