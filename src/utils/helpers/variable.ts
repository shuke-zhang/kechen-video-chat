/**
 * 手机号正则
 */
export const validatePhoneReg = /^1([38]\d|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
/**
 * 身份证号正则
 */
export const validateIdCardReg = /(^\d{15}$)|(^\d{17}([0-9X])$)/
/**
 * 邮箱正则
 */
export const validateEmailReg = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
/**
 * 验证码正则表达式
 */
export const validateCodeReg = /^\d{6}$/
