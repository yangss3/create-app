import { reactive, ref, toRaw } from 'vue'
import { http, ApiKey, RequestConfig } from '@/service'
import { message, Modal } from 'ant-design-vue'
import { useI18n } from '@yangss/vue3-i18n'

interface PagerParams {
  currentPage: number
  pageSize: number
}

/** Table 的增删改查逻辑
 * @param url Request url
 * @param queryParamsRaw Query parameters
 */
export default <T extends { id: string }, Q = Record<string, unknown>>(
  url: ApiKey,
  queryParamsRaw?: Q
) => {
  const loading = ref(false)

  const data = reactive({
    list: [] as T[],
    total: 0
  })

  const queryParams = reactive<Q & PagerParams>({
    currentPage: 1,
    pageSize: 20,
    ...(queryParamsRaw || ({} as Q))
  })

  async function getData (
    params?: Record<string, unknown>,
    config: RequestConfig = {}
  ) {
    try {
      loading.value = true
      const res = await http.get(url, params || toRaw(queryParams), config)
      loading.value = false
      data.list = res.list as any[]
      data.total = res.total
    } catch (error) {
      loading.value = false
    }
  }

  async function postData (params: Partial<T>, config: RequestConfig = {}) {
    try {
      loading.value = true
      await http.post(url, params, config)
      loading.value = false
      getData()
    } catch (error) {
      loading.value = false
    }
  }

  async function putData (params: Partial<T>, config: RequestConfig = {}) {
    try {
      loading.value = true
      await http.put(url, toRaw(params || data), config)
      loading.value = false
      getData()
    } catch (error) {
      loading.value = false
    }
  }

  async function deleteData (params: any, config: RequestConfig = {}) {
    try {
      loading.value = true
      await http.delete(url, params, config)
      loading.value = false
      getData()
    } catch (error) {
      loading.value = false
    }
  }

  /**
   * 处理 table 分页、过滤
   * @param pagination
   * @param filter
   * @param sorter
   */
  async function handleTableChange (
    pagination: Record<string, any>,
    filter: Record<string, any>,
    sorter: Record<string, any>
  ) {
    queryParams.currentPage = pagination.current
    queryParams.pageSize = pagination.pageSize

    Object.keys(filter).forEach((key) => {
      queryParams[key as keyof typeof queryParams] = filter[key]
    })
    Object.keys(sorter).forEach((key) => {
      queryParams[key as keyof typeof queryParams] = sorter[key]
    })
    await getData()
  }

  const { t } = useI18n()

  /**
   * 删除表格行
   * @param row 要删除的行或行数组
   * @param validator 执行删除前的校验函数，可选
   */
  function handleTableDelete (
    row: T | T[],
    validator?: (record: T[]) => boolean
  ) {
    const items = Array.isArray(row) ? row : [row]
    if (items.length === 0) {
      message.info(t('please-select-at-least-one-record'))
    } else {
      if (!validator || validator(items)) {
        Modal.confirm({
          title: t('prompt'),
          content: t(
            items.length > 1
              ? 'are-you-sure-you-want-to-delete-these-records'
              : 'are-you-sure-you-want-to-delete-this-record'
          ),
          onOk: async () => {
            await deleteData(items.map((r) => r.id))
          }
        })
      }
    }
  }

  return {
    getData,
    postData,
    putData,
    deleteData,
    handleTableChange,
    handleTableDelete,
    data,
    loading,
    queryParams
  }
}
