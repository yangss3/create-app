import { ApiKey, http, RequestConfig } from '@/service'
import { reactive, ref } from 'vue'
import { useForm as antUseForm } from '@ant-design-vue/use'
import { validateInfo } from '@ant-design-vue/use/lib/useForm'
import { cloneDeep, merge } from 'lodash-es'
import { RuleFunc, Rule } from '@/utils/types'

export default function useForm<
  T extends Record<string, any>,
  K extends Partial<Record<keyof T, Rule>>
> (apiKey: ApiKey, formRaw: T, rulesRaw: K) {
  const form = reactive(cloneDeep(formRaw))

  for (const key in rulesRaw) {
    if (typeof rulesRaw[key] === 'function') {
      const rule = rulesRaw[key] as RuleFunc
      rulesRaw[key] = rule(form) as any
    }
  }

  const formUtils = antUseForm(form, reactive(rulesRaw as Record<string, any>))

  const loading = ref(false)

  async function save (
    type: 'post' | 'put',
    custom?: any,
    config?: RequestConfig
  ) {
    try {
      await formUtils.validate()
      loading.value = true
      await http[type](apiKey, custom || form, config)
      loading.value = false
    } catch (error) {
      loading.value = false
      throw error
    }
  }

  async function getForm (
    params: Record<string, unknown> = {},
    config?: RequestConfig
  ) {
    try {
      loading.value = true
      const res = await http.get<T>(apiKey, params, config)
      loading.value = false
      merge(form, res)
    } catch (error) {
      loading.value = false
    }
  }

  async function postForm (custom?: any, config?: RequestConfig) {
    await save('post', custom, config)
  }

  async function putForm (custom?: any, config?: RequestConfig) {
    await save('put', custom, config)
  }

  return {
    getForm,
    postForm,
    putForm,
    form,
    validateInfos: formUtils.validateInfos as Record<keyof K, validateInfo>,
    formUtils,
    loading
  }
}
