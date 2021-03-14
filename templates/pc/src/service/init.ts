import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import store from '@/store'
import router from '@/router'
import { Response } from '@/service'
import { message } from 'ant-design-vue'

const baseConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.DEV ? '/api' : '',
  timeout: 10000,
  withCredentials: true
}

const requestInterceptor = {
  success: (config: AxiosRequestConfig) => {
    config.headers.Authorization = store.state.token || ''
    config.headers.username = store.state.username || ''
    config.headers['Accept-Language'] = store.state.locale || 'zh'
    return config
  },
  error: (error: any) => Promise.reject(error)
}

const responseInterceptor = {
  success: (response: AxiosResponse<Response>) => {
    return response
  },
  error: (error: AxiosError<Response>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          message.error(error.response?.data.message || error.message)
          store.commit('UPDATE_AUTH', null)
          router.replace('/login')
          break
        default:
          message.error(error.response?.data.message || error.message)
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      message.error(error.message)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message)
    }

    return Promise.reject<Response>(error)
  }
}

const instance = axios.create(baseConfig)

instance.interceptors.request.use(
  requestInterceptor.success,
  requestInterceptor.error
)

instance.interceptors.response.use(
  responseInterceptor.success,
  responseInterceptor.error
)

export default instance
