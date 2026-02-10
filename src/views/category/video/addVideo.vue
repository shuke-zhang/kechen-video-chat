<script setup lang="ts">
import type { CharacterModel } from '@/model/character'
import type { TextRolePayload, TextSplitPayload, VideoModel } from '@/model/video'
import type { VoiceModel } from '@/model/voice'
import { Back } from '@element-plus/icons-vue'
import { getCharacterList } from '@/api/character'
import { addVideo, PutVideo, textRole, textVideo } from '@/api/video'
import { getVoiceList } from '@/api/voice'
import TextRoleDialog from './textRoleDialog.vue'
import { result111 } from './textSplit'
import TextSplitDialog from './textSplitDialog.vue'

const useAddVideoStore = useAddVideo()
const category = useCategoryStore()
const router = useRouter()
const textSplitVisible = ref(false)
const textSplitData = ref<TextSplitPayload[]>([])
const textSplitVideoUrl = ref('')
const visible = ref(false)
const textRoleData = ref<TextRolePayload[]>([])
const formRef = useTemplateRef('formRef')
const voiceLoading = ref(false)
const voiceList = ref<VoiceModel[]>([])
const characterLoading = ref(false)
const characterList = ref<CharacterModel[]>([])

const form = ref<VideoModel>({
  publishStatus: 0,
  videoText: '在天空的尽头，有一间小小的云朵裁缝铺。\n店主是一只年迈的白猫，名叫絮絮。它不缝衣服，而是用晨雾做线、晚霞当布，为伤心的人缝补破碎的梦。一天，一个小女孩坐在屋顶上哭泣。她的风筝断了线，飞进了乌云里，再也没回来。\n“那是妈妈最后送我的礼物……”她抽泣着说。絮絮轻轻跳上屋顶，从怀里掏出一团蓬松的云：“别怕，我帮你把它缝回来。”它用月光穿针，把星星缀在风筝的角上，又剪下一小片彩虹做尾巴。\n第二天清晨，小女孩睁开眼——那只风筝正轻轻落在她的窗台上，比从前更亮、更轻，仿佛能带人飞到任何想念的地方。\n\n从此，每当有人失落或难过，絮絮就会悄悄出现在他们梦里，问一句：\n“需要我为你缝点什么吗？”\n\n寓意：温柔与善意，能修补世间最细碎的遗憾。',
  videoName: '《云朵裁缝》',
})

const expandText = ref('')
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
    videoName: category.currentCategory?.showTextTitle ? form.value.videoName : undefined,
    videoText: form.value.videoText,
  }).then((res) => {
    if (res.data.add_role.length <= 0) {
      return showMessageSuccess('检测到已有角色，无须生成')
    }
    else {
      textRoleData.value = res.data.add_role || []
      expandText.value = res.data.expand_text

      visible.value = true
      console.log('')
    }
  }).finally(() => {
    roleLoading.value = false
  })
}

function handleTextVideo() {
  if (textVideoLoading.value)
    return
  textVideoLoading.value = true
  textVideo({
    projectId: category.currentProject?.id,
    publishStatus: form.value.publishStatus,
    videoName: form.value.videoName,
    videoText: form.value.videoText,
    expandText: expandText.value,
  }).then((res) => {
    textSplitData.value = res.data.plot_image
    console.log(textSplitData.value, '内容')
    textSplitVisible.value = true
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

function handleTextSplit(url: string) {
  textSplitVideoUrl.value = url
}

function submit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (!textSplitVideoUrl.value) {
        showMessageError('请先生成视频')
        return
      }
      if (submitLoading.value)
        return
      submitLoading.value = true
      const data: VideoModel = {
        ...form.value,
        videoUrl: textSplitVideoUrl.value,
        projectId: category.currentProject?.id,
        // videoName: category.currentCategory?.showTextTitle ? form.value.videoName : undefined,
      }
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

function test() {
  textSplitData.value = result111 as any
  textSplitVisible.value = true
}

/**
 * 远程搜索系统音色
 */
function voiceMethod() {
  if (voiceLoading.value)
    return
  voiceLoading.value = true
  getVoiceList({
    page: {
      current: 1,
      size: 10000,
    },
    projectId: category.currentProject?.id,
  })
    .then((res) => {
      voiceList.value = res.data.records
      console.log(voiceList.value, 'voiceList.value')
    })
    .finally(() => {
      voiceLoading.value = false
    })
}

/**
 * 搜索角色
 */
function characterListMethod() {
  if (characterLoading.value)
    return
  characterLoading.value = true
  getCharacterList({
    page: {
      current: 1,
      size: 10000,
    },
    projectId: category.currentProject?.id,
  }).then((res) => {
    characterList.value = res.data.records
    console.log(characterList.value, 'characterList')
  }).finally(() => {
    characterLoading.value = false
  })
}

onMounted(() => {
  voiceMethod()
  characterListMethod()
})
</script>

<template>
  <div class="app-container h-full flex">
    <div class="card size-full">
      <div class="flex justify-between">
        <div>{{ isAdd ? "新增视频" : "编辑视频" }}</div>
        <el-button :icon="Back" @click="router.back()">
          返回
        </el-button>

        <el-button v-if="false" :icon="Back" @click="test">
          测试
        </el-button>
      </div>

      <el-divider />

      <div class="flex-1 overflow-y-auto px-[10px]">
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
                  <el-button v-if="category.currentCategory?.showCharacter" :loading="roleLoading" @click="handleRole">
                    角色
                  </el-button>
                  <el-button :loading="textVideoLoading" @click="handleTextVideo">
                    生成
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

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

    <TextRoleDialog v-model="visible" :data="textRoleData" :voice-list="voiceList" />

    <TextSplitDialog v-model="textSplitVisible" :data="textSplitData" :character-list="characterList" @success="handleTextSplit" />
  </div>
</template>

<style scoped lang="scss">
</style>
