import apiUrlMap from './apiUrlMap'
import axiosInstance from './init'
import { message } from 'ant-design-vue'
import { App } from 'vue'
import { AxiosRequestConfig } from 'axios'

export type ApiKey = keyof typeof apiUrlMap

export type RequestConfig = AxiosRequestConfig & {
  showMsg?: boolean
  subPath?: string
}

export interface PaginatedResponseData {
  list: unknown[]
  total: number
}

export interface Response<T = null> {
  success: boolean
  data?: T
  message?: string
}

function handleResponse<T> (res: Response<T>, config: RequestConfig) {
  if (res.success) {
    config.showMsg && res.message && message.success(res.message)
    return res.data
  } else {
    config.showMsg && res.message && message.error(res.message)
    throw res
  }
}

function formatPath (base: string, subPath?: string) {
  return subPath
    ? base + (subPath.startsWith('/') ? subPath : `/${subPath}`)
    : base
}

export const http = {
  async get<T = PaginatedResponseData> (
    apiKey: ApiKey,
    data: Record<string, unknown> = {},
    config: RequestConfig = {}
  ) {
    const res = await axiosInstance.get<Response<T>>(
      formatPath(apiUrlMap[apiKey], config.subPath),
      {
        params: data,
        ...config
      }
    )
    config = { showMsg: !res.data.success, ...config }
    return handleResponse(res.data, config)!
  },

  async getBlob (
    apiKey: ApiKey,
    data: Record<string, unknown> = {},
    config: RequestConfig = {}
  ) {
    const res = await axiosInstance.get(
      formatPath(apiUrlMap[apiKey], config.subPath),
      { params: data, ...config }
    )
    return res.data
  },

  async post<T = null> (
    apiKey: ApiKey,
    data: Record<string, unknown> | FormData = {},
    config: RequestConfig = {}
  ) {
    const res = await axiosInstance.post<Response<T>>(
      formatPath(apiUrlMap[apiKey], config.subPath),
      data,
      config
    )
    config = { showMsg: true, ...config }
    return handleResponse(res.data, config)!
  },

  async delete<T = null> (
    apiKey: ApiKey,
    data: Record<string, unknown> = {},
    config: RequestConfig = {}
  ) {
    const res = await axiosInstance.delete<Response<T>>(
      formatPath(apiUrlMap[apiKey], config.subPath),
      {
        data,
        ...config
      }
    )
    config = { showMsg: true, ...config }
    return handleResponse(res.data, config)!
  },

  async put<T = null> (
    apiKey: ApiKey,
    data: Record<string, unknown>,
    config: RequestConfig = {}
  ) {
    const res = await axiosInstance.put<Response<T>>(
      formatPath(apiUrlMap[apiKey], config.subPath),
      data,
      config
    )
    config = { showMsg: true, ...config }
    return handleResponse(res.data, config)!
  }
}

export default (app: App) => {
  app.config.globalProperties.$http = http
}
