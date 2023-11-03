interface UserModel extends Auth.UserInfo {
  accessToken: string;
  refreshToken: string;
  password: string;
}

export const userModel: UserModel[] = [
  {
    accessToken: '__TOKEN_SOYBEAN__',
    refreshToken: '__REFRESH_TOKEN_SOYBEAN__',
    roles: ['super'],
    password: 'SoybeanPassword1$',
    permissions: [],
    sysUser: {
      id: '1',
      createBy: 'admin',
      createId: '1',
      createTime: new Date(),
      username: 'admin',
      password: '',
      realName: '',
      nickName: '',
      sex: '',
      phone: '15666666666',
      phoneVerified: 1,
      emailVerified: 0,
      status: 1
    }
  },
  {
    accessToken: '__TOKEN_SUPER__',
    refreshToken: '__REFRESH_TOKEN_SUPER__',
    roles: ['super'],
    password: 'super123',
    permissions: [],
    sysUser: {
      id: '1',
      createBy: 'admin',
      createId: '1',
      createTime: new Date(),
      username: 'Super',
      password: 'Super',
      realName: 'Super',
      nickName: 'Super',
      sex: '',
      phone: '15666666666',
      phoneVerified: 1,
      emailVerified: 0,
      status: 1
    }
  },
  {
    accessToken: '__TOKEN_ADMIN__',
    refreshToken: '__REFRESH_TOKEN_ADMIN__',
    roles: ['admin'],
    password: 'admin123',
    permissions: [],
    sysUser: {
      id: '1',
      createBy: 'admin',
      createId: '1',
      createTime: new Date(),
      username: 'Admin',
      password: 'Admin',
      realName: 'Admin',
      nickName: 'Admin',
      sex: '',
      phone: '15666666666',
      phoneVerified: 1,
      emailVerified: 0,
      status: 1
    }
  },
  {
    accessToken: '__TOKEN_USER01__',
    refreshToken: '__REFRESH_TOKEN_USER01__',
    roles: ['user'],
    password: 'user01123',
    permissions: [],
    sysUser: {
      id: '1',
      createBy: 'admin',
      createId: '1',
      createTime: new Date(),
      username: 'User01',
      password: '',
      realName: 'User01',
      nickName: 'User01',
      sex: '',
      phone: '15666666666',
      phoneVerified: 1,
      emailVerified: 0,
      status: 1
    }
  }
];
