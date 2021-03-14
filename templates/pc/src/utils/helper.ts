//  文件转 base64
export function fileToBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
  })
}

// 文件分片
export function sliceFile(file: File, size: number = 20 * 1024 * 1024) {
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

// 文件下载
export function downloadFile(
  file: Blob | string,
  fileName: string,
  fileType?: string
) {
  let url: string
  if (typeof file === 'string') {
    url = file
  } else {
    const data = new Blob([file], { type: fileType })
    url = URL.createObjectURL(data)
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
