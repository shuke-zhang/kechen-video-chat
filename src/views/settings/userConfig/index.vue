<script setup lang="ts">
import type { UserConfigModel } from '@/model/userConfig'
import { getUserConfigList, putUserConfig } from '@/api/userConfig'

const formRef = useTemplateRef('formRef')
const form = ref<Record<string, string>>({})
const userConfigList = ref<UserConfigModel[]>([])
const loading = ref(false)
const init = ref(false)

const rules = {
  videoName: [{ required: true, trigger: 'blur', message: '请输入视频名称' }],
  videoUrl: [{ required: true, trigger: 'blur', message: '请输入视频链接地址' }],
  publishStatus: [{ required: true, trigger: 'blur', message: '请选择是否公开' }],
  videoText: [{ required: true, trigger: 'blur', message: '请输入视频文本' }],
  coverUrl: [{ required: true, trigger: 'blur', message: '请上传视频封面' }],
}

function submit(item: UserConfigModel) {
  formRef.value?.validate((valid) => {
    if (valid) {
      const data: UserConfigModel = {
        ...item,
        dictKey: item.dictKey,
        dictValue: form.value[item.dictKey!],
      }
      putUserConfig(data).then(() => {
        showMessageSuccess('操作成功')
        getList()
      })
    }
  })
}
function getList() {
  if (loading.value)
    return
  loading.value = true
  getUserConfigList({
    page: {
      current: 1,
      size: 1000,
    },
  }).then((res) => {
    userConfigList.value = res.data.records.map((it) => {
      form.value[it.dictKey!] = it.dictValue || '0'
      return {
        ...it,
        inactiveText: it.dictKey === 'default_video_mode' ? '图片生成模式' : '关闭',
        activeText: it.dictKey === 'default_video_mode' ? '视频生成模式' : '打开',
      }
    })
    nextTick(() => {
      init.value = true
    })
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="app-container h-full flex">
    <div class="card size-full">
      <div class="flex justify-between">
        <div>个人设置</div>
      </div>

      <el-divider />

      <div v-loading="loading" class="flex-1 overflow-y-auto px-[10px] min-h-[100px]">
        <el-form
          ref="formRef"
          :inline="false"
          :rules="rules"
          :model="form"
        >
          <el-row :gutter="20">
            <el-col v-for="item in userConfigList" :key="item.dictKey" :span="12">
              <el-form-item
                :label="`${item.dictDesc}：`"
                :rules="[{
                  message: `${item.dictDesc}不能为空`,
                }]"
              >
                <el-switch
                  v-model="form[item.dictKey!]"
                  :active-text="item.activeText"
                  active-value="1"
                  :inactive-text="item.inactiveText"
                  inactive-value="0"
                  @change="($event) => init && submit(item)"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- <div class="flex justify-end">
        <el-button @click="cancel">
          取 消
        </el-button>

        <el-button type="primary" :loading="submitLoading" @click="submit">
          提 交
        </el-button>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
