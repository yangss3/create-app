/* eslint-disable */
import axiosInstance from './init'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axiosInstance)

mock.onPost('/api/login').reply((config) => {
  const language = config.headers['Accept-Language']
  const isZh = language === 'zh'

  return [
    200,
    {
      success: true,
      data: {
        token: Date.now().toString()
      }
    }
  ]
})

mock.onGet('/api/menus').reply((config) => {
  const language = config.headers['Accept-Language']
  const isZh = language === 'zh'

  return [
    200,
    {
      success: true,
      data: [
        {
          id: 'a',
          path: '#system-management',
          name: 'SystemManagement',
          icon: 'UserOutlined',
          title: isZh ? '系统管理' : 'System Management',
          children: [
            {
              id: 'aa',
              parentId: 'a',
              path: '/',
              name: 'UserManagement',
              title: isZh ? '用户管理' : 'User Management'
            }
          ]
        }
      ],
      message: ''
    }
  ]
})

mock.onGet('/api/user').reply((config) => {
  const language = config.headers['Accept-Language']
  const isZh = language === 'zh'

  return [
    200,
    {
      success: true,
      data: {
        id: Date.now().toString(),
        username: 'Nicholas',
        email: 'nicholas@gmail.com',
        photo: 'https://picsum.photos/100',
        role: 'ADMIN',
        disabled: false,
        createdDate: '2020-01-12'
      }
    }
  ]
})

mock.onPost('/api/logout').reply((config) => {
  const language = config.headers['Accept-Language']
  const isZh = language === 'zh'

  return [
    200,
    {
      success: true,
      message: isZh ? '退出成功' : 'Logout successfully'
    }
  ]
})

mock.onGet('/api/userList').reply((config) => {
  const language = config.headers['Accept-Language']
  const isZh = language === 'zh'

  return [
    200,
    {
      success: true,
      data: {
        list: Array(32)
          .fill(0)
          .map((_, i) => ({
            id: i + 1,
            username: 'Nicholas' + i,
            email: 'nicholas@gmail.com',
            photo: 'https://picsum.photos/100',
            role: ['ADMIN', 'USER'][i % 2],
            status: false,
            createdDate: '2020-01-12'
          })),
        total: 30
      }
    }
  ]
})
