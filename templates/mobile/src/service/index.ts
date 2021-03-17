import apiUrlMap from './apiUrlMap'
import axiosInstance from './init'
import { Toast  } from 'vant'
import { App } from 'vue'
import { AxiosRequestConfig } from 'axios'

export type ApiKey = keyof typeof apiUrlMap

export interface PaginatedResponseData {
  list: unknown[]
  total: number
  pageSize?: number
  pageIndex?: number
}

export interface Response<T = null> {
  success: boolean
  data?: T
  message?: string
}

type Method = 'get' | 'post' | 'put' | 'delete'

function handleResponse<T>(res: Response<T>, method?: Method) {
  if (res.success) {
    if (method === 'get') {
      return res.data
    } else {
      res.message && Toast.success(res.message)
      return res.data
    }
  } else {
    res.message && Toast.fail(res.message)
    throw new Error(res.message)
  }
}

export const http = {
  async get<T = PaginatedResponseData>(
    apiKey: ApiKey,
    data: Record<string, unknown> = {},
    config: AxiosRequestConfig = {}
  ) {
    const res = await axiosInstance.get<Response<T>>(apiUrlMap[apiKey], {
      params: data,
      ...config
    })
    return handleResponse(res.data, 'get')!
  },

  async post<T = null>(
    apiKey: ApiKey,
    data: Record<string, unknown> | FormData = {},
    config: AxiosRequestConfig = {}
  ) {
    const res = await axiosInstance.post<Response<T>>(
      apiUrlMap[apiKey],
      data,
      config
    )
    return handleResponse(res.data)!
  },

  async delete<T = null>(
    apiKey: ApiKey,
    data: Record<string, unknown> = {},
    config: AxiosRequestConfig = {}
  ) {
    const res = await axiosInstance.delete<Response<T>>(apiUrlMap[apiKey], {
      data,
      ...config
    })
    return handleResponse(res.data)!
  },

  async put<T = null>(
    apiKey: ApiKey,
    data: Record<string, unknown>,
    config: AxiosRequestConfig = {}
  ) {
    const res = await axiosInstance.put<Response<T>>(
      apiUrlMap[apiKey],
      data,
      config
    )
    return handleResponse(res.data)!
  }
}

export default (app: App) => {
  app.config.globalProperties.$http = http
}
