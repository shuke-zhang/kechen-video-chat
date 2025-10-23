export const useDictStore = defineStore('dict', () => {
  const dict = ref<
    {
      key: string
      value: {
        label: string
        value: string
        dictType: string
      }[]
    }[]
  >([])

  return {
    dict,
    getDict,
    setDict,
    removeDict,
    cleanDict,
  }

  /**
   * 获取字典
   */
  function getDict(_key: string) {
    if (_key == null && _key === '') {
      return null
    }
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key === _key) {
          return dict.value[i].value
        }
      }
    }
    catch (_e) {
      return null
    }
  }
  // 设置字典
  function setDict(
    _key: string,
    value: {
      label: string
      value: string
      dictType: string
    }[],
  ) {
    if (_key !== null && _key !== '') {
      dict.value.push({
        key: _key,
        value,
      })
      console.log(dict.value, 'setDict')
    }
  }
  // 删除字典
  function removeDict(_key: string) {
    let bln = false
    try {
      for (let i = 0; i < dict.value.length; i++) {
        if (dict.value[i].key === _key) {
          dict.value.splice(i, 1)
          return true
        }
      }
    }
    catch (_e) {
      bln = false
    }
    return bln
  }
  // 清空字典
  function cleanDict() {
    dict.value = []
  }
}, {
  persist: {
    key: 'DICT',
    storage: localStorage,
  },
})
