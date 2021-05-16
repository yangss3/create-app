import { emailRegEx, fileType, passwordRegEx, phoneNumberRegEx } from './constants'
import { useI18n } from '@yangss/vue3-i18n'

//  文件转 base64
export function fileToBase64 (file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
  })
}

// 文件分片
export function sliceFile (file: File, size: number = 20 * 1024 * 1024) {
  let start = 0
  let end = start + size
  const chunks: Blob[] = []

  while (start < file.size) {
    chunks.push(file.slice(start, end))
    start = end
    end = start + size
  }

  return chunks
}

/**
 * 文件下载
 * @param file 文件流或base64
 * @param fileName 文件名
 * @param type 文件类型
 */
export function downloadFile(file: string, fileName: string): void
export function downloadFile(
  file: Blob,
  fileName: string,
  type: keyof typeof fileType
): void
export function downloadFile (
  file: string | Blob,
  fileName: string,
  type?: keyof typeof fileType
) {
  let url: string
  if (typeof file === 'string') {
    url = file
  } else if (type) {
    const data = new Blob([file], { type: fileType[type] })
    url = URL.createObjectURL(data)
  } else {
    return
  }

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  if (typeof file !== 'string') {
    URL.revokeObjectURL(url)
  }
}

/**
 * ant-design-vue 表单校验规则
 * @param type 校验类型 https://github.com/yiminghe/async-validator#type
 * @param message 错误提示信息
 */
export function requiredField (
  type = 'string',
  message?: string
) {
  if (!message) {
    const { t } = useI18n()
    message = t('this-field-is-required')
  }
  return {
    required: true,
    message,
    type
  }
}

export const isValidPhoneNumber = (val: string) => phoneNumberRegEx.test(val)
export const isValidEmail = (val: string) => emailRegEx.test(val)
export const isValidPassword = (val: string) => passwordRegEx.test(val)


// /**
//  * 导出表格数据到excel
//  * @param columns 要导出的表格列
//  * @param tableData 表格数据
//  * @param fileName 导出文件名
//  * @param replace  可选，字段名替换，默认：{title: 'title', key: 'dataIndex'}
//  */
//  export function exportTableToExcel(
//   columns: Record<string, any>[],
//   tableData: Record<string, string | number>[],
//   fileName: string,
//   replace?: { title?: string; key?: string }
// ) {
//   let title = 'title',
//     key = 'dataIndex'
//   if (replace) {
//     title = replace.title || title
//     key = replace.key || key
//   }
//   const rawData = tableData.map((item) => {
//     return columns.reduce((prev, cur) => {
//       prev[cur[title]] = item[cur[key]]
//       return prev
//     }, {})
//   })

//   if (rawData.length > 0) {
//     const sheet = xlsx.utils.json_to_sheet(rawData)
//     const workBook = xlsx.utils.book_new()
//     xlsx.utils.book_append_sheet(workBook, sheet)
//     xlsx.writeFile(workBook, fileName + '.xlsx')
//   }
// }
