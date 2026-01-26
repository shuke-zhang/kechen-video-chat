<script setup lang="ts">
import type { VideoModel } from '@/model/video'
import { Back } from '@element-plus/icons-vue'
import { addVideo, PutVideo, textRole, textVideo } from '@/api/video'

const useAddVideoStore = useAddVideo()
const category = useCategoryStore()
const router = useRouter()
const formRef = useTemplateRef('formRef')
const form = ref<VideoModel>({
  publishStatus: 0,
  videoText: '在天空的尽头，有一间小小的云朵裁缝铺。\n店主是一只年迈的白猫，名叫絮絮。它不缝衣服，而是用晨雾做线、晚霞当布，为伤心的人缝补破碎的梦。一天，一个小女孩坐在屋顶上哭泣。她的风筝断了线，飞进了乌云里，再也没回来。\n“那是妈妈最后送我的礼物……”她抽泣着说。絮絮轻轻跳上屋顶，从怀里掏出一团蓬松的云：“别怕，我帮你把它缝回来。”它用月光穿针，把星星缀在风筝的角上，又剪下一小片彩虹做尾巴。\n第二天清晨，小女孩睁开眼——那只风筝正轻轻落在她的窗台上，比从前更亮、更轻，仿佛能带人飞到任何想念的地方。\n\n从此，每当有人失落或难过，絮絮就会悄悄出现在他们梦里，问一句：\n“需要我为你缝点什么吗？”\n\n寓意：温柔与善意，能修补世间最细碎的遗憾。',
  videoName: '《云朵裁缝》',
})
const submitLoading = ref(false)

const roleLoading = ref(false)
const textVideoLoading = ref(false)

const rules = {
  videoName: [{ required: true, trigger: 'blur', message: '请输入视频名称' }],
  videoUrl: [{ required: true, trigger: 'blur', message: '请输入视频链接地址' }],
  publishStatus: [{ required: true, trigger: 'blur', message: '请选择是否公开' }],
  videoText: [{ required: true, trigger: 'blur', message: '请输入视频文本' }],
  coverUrl: [{ required: true, trigger: 'blur', message: '请上传视频封面' }],
}

const isAdd = computed(() => useAddVideoStore.isAdd)

function handleRole() {
  if (roleLoading.value)
    return
  roleLoading.value = true
  textRole({
    projectId: category.currentProject?.id,
    publishStatus: form.value.publishStatus,
    videoName: form.value.videoName,
    videoText: form.value.videoText,
  }).then((res) => {
    if (res.data.add_role.length <= 0) {
      return showMessageSuccess('检测到已有角色，无须生成')
    }
    else {
      console.log(',,')
    }
  }).finally(() => {
    roleLoading.value = false
  })
}

function handleTextVideo() {
  if (textVideoLoading.value)
    return
  textVideoLoading.value = true
  console.log(category.currentProject, '内容')

  textVideo({
    projectId: category.currentProject?.id,
    publishStatus: form.value.publishStatus,
    videoName: form.value.videoName,
    videoText: form.value.videoText,
  }).finally(() => {
    textVideoLoading.value = false
  })
}

function reset() {
  form.value = {
    publishStatus: 0,

  }
  resetForm(formRef.value)
  submitLoading.value = false
}

function cancel() {
  console.log('触发取消')
  reset()
}

function submit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (submitLoading.value)
        return
      submitLoading.value = true
      const data: VideoModel = {
        ...form.value,
      }
      console.log(data, 'submit')
      const api = isAdd.value ? addVideo : PutVideo
      api(data).then(() => {
        showMessageSuccess('操作成功')
        reset()
        router.back()
        // 触发父组件刷新
      }).catch(() => {
        submitLoading.value = false
      })
    }
  })
}
</script>

<template>
  <div class="app-container ">
    <div class="card size-full">
      <div class="flex justify-between">
        <div>{{ isAdd ? "新增视频" : "编辑视频" }}</div>
        <el-button :icon="Back" @click="router.back()">
          返回
        </el-button>
      </div>
      <el-divider />

      <el-form
        ref="formRef"
        :inline="false"
        :rules="rules"
        :model="form"
        class="large-form"
        label-width="100"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否公开" prop="publishStatus">
              <el-switch
                v-model="form.publishStatus"
                active-text="公开"
                :active-value="1"
                inactive-text="不公开"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文本标题" prop="videoName" style="width: 100%">
              <el-input
                v-model="form.videoName"
                type="textarea"
                :min-rows="2"
                clearable
                placeholder="请输入文本标题"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="内容" prop="videoText" style="width: 100%">
              <el-input
                v-model="form.videoText"
                type="textarea"
                :min-rows="6"
                autosize
                clearable
                placeholder="请输入文本标题"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="" class="w-full">
              <div class="w-full flex justify-end gap-[10px]">
                <el-button :loading="roleLoading" @click="handleRole">
                  生成角色
                </el-button>
                <el-button :loading="textVideoLoading" @click="handleTextVideo">
                  生成
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider />

      <div class="flex justify-end">
        <el-button @click="cancel">
          取 消
        </el-button>

        <el-button type="primary" :loading="submitLoading" @click="submit">
          提 交
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
