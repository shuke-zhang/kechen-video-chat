import type { HttpRequestConfig } from '@shuke~/request'
import type { UserCustomConfig } from './types'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import { saveAs } from 'file-saver'
import { blobValidate, getErrorMessageByStatus, tansParams } from '../helpers'
import { request } from './index'

type ServiceType = 'get' | 'post'
type DownloadRequestConfig = HttpRequestConfig<UserCustomConfig>
// 定义下载加载实例的类型
let downloadLoadingInstance: ReturnType<typeof ElLoading.service>
// 通用下载方法
/**
 * @description 通用下载方法
 * @param url 下载url
 * @param data 所需要传递的内容
 * @param _filename 下载的文件名，默认取响应头的文件名
 * @param serviceType 接口请求的方式 支持 'get' 'post'
 * @param config 其他可选的配置参数
 *  使用示例-download(url, {}, `模板.xlsx`, 'get');
 *  使用示例-download.get({});
 *  使用示例-download.post({});
 */
export function download(
  url: string,
  data: Record<string, any>, // 可以根据 params 结构更精细化定义
  _filename: string,
  serviceType: ServiceType,
  config?: DownloadRequestConfig, // 可选的请求配置参数
) {
  downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' })
  console.log(config, 'config')

  return request.request<File>({
    url,
    data,
    getResponse: true,
    transformRequest: [
      (data) => {
        return tansParams(data)
      },
    ],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    joinTime: false,
    ...config,
  })
    .then(async (res) => {
      /**
       * 获取响应头里面的文件名
       */
      const responseFilename = getResponseFilename(res as any)

      const filename = responseFilename || _filename
      console.log(responseFilename, 'responseFilename')

      const isBlob = blobValidate(res.data)

      if (isBlob) {
        const blob = new Blob([res.data])
        saveAs(blob, filename)
      }
      else {
        const resText = await res.data.text()
        const rspObj = JSON.parse(resText)
        const errMsg = getErrorMessageByStatus(rspObj.code) || rspObj.msg || getErrorMessageByStatus('default')
        if (errMsg.includes('@comfirm@')) {
          ElMessageBox.alert(errMsg.replace('@comfirm@', ''), '提示', {
            type: 'error',
            dangerouslyUseHTMLString: true,
            customClass: 'error-message-box',
          })
        }
        else {
          ElMessage.error(errMsg)
        }
      }
      downloadLoadingInstance.close()
    })
    .catch((r) => {
      console.error(r)
      // Message.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
    .finally(() => {
      downloadLoadingInstance.close()
    })
}
// 函数重载：get 请求
download.get = function ({
  url,
  data = {},
  filename,
  config,
}: {
  url: string
  data?: Record<string, any>
  filename: string
  config?: DownloadRequestConfig
}) {
  return download(url, data, filename, 'get', config)
}

// 函数重载：post 请求
download.post = function ({
  url,
  data = {},
  filename,
  config,
}: {
  url: string
  data?: Record<string, any>
  filename: string
  config?: DownloadRequestConfig
}) {
  return download(url, data, filename, 'post', config)
}

/**
 * 获取相应头里面的文件名
 */
export function getResponseFilename(data: { headers: Record<string, string> }) {
  const disposition = data.headers['content-disposition']

  // 获取响应头中的文件名后端需要同时设置
  // response.setHeader("Access-Control-Expose-Headers", "Content-Disposition")
  // response.setHeader("Content-Disposition", ...)
  /**
   * decodeURIComponent 用于解码
   * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
   */
  if (disposition) {
    const filename = decodeURIComponent(disposition.split('filename=')[1])
    // replace(/['"]/g, '').trim() 主要是去除后端返回的文件名中是单引号或者双引号包裹的文件名
    return filename.replace(/^['"]?|['"]?$/g, '').trim()
  }
  else {
    return undefined
  }
}
