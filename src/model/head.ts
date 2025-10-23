/**
 * 下拉菜单项的值类型
 * - put: 修改
 * - logout: 退出
 */
export type UserDropdownValueModel = 'put' | 'logout'

/**
 * 头部nav菜单项值类型
 * -  device : 设备管理
 * - patient: 患者
 * - visitRecord: 治疗记录
 * - report: 报告
 * - settings: 设置
 */
export type TopNavValueModel = 'device' | 'patient' | 'visitRecord' | 'report' | 'settings'
