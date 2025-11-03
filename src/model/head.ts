/**
 * 下拉菜单项的值类型
 * - put: 修改
 * - logout: 退出
 */
export type UserDropdownValueModel = 'put' | 'logout'
export type CategoryValue = 'category' | `/category/${number}`
/**
 * 头部nav菜单项值类型
 * -  home : 首页
 * -  类别 : category
 * -  工单 : workOrder
 * -  设置 : settings
 */
export type TopNavValueModel = 'home' | CategoryValue | 'category' | 'workOrder' | 'settings'
