export { }
declare global {
  interface Window {
    webConfig: {
      /**
       * dist下直接配置ip地址
       */
      webApiBaseUrl: string
    }
  }
}
