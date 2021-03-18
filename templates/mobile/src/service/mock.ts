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

