<script setup lang="ts">
import type { TextRolePayload, TextSplitPayload, VideoModel } from '@/model/video'
import type { VoiceModel } from '@/model/voice'
import { Back } from '@element-plus/icons-vue'
import { addVideo, PutVideo, textRole } from '@/api/video'
import { getVoiceList } from '@/api/voice'
import TextRoleDialog from './textRoleDialog.vue'
import TextSplitDialog from './textSplitDialog.vue'

const useAddVideoStore = useAddVideo()
const category = useCategoryStore()
const router = useRouter()
const textSplitVisible = ref(false)
const textSplitData = ref<TextSplitPayload[]>([])
const visible = ref(false)
const textRoleData = ref<TextRolePayload[]>([])
const formRef = useTemplateRef('formRef')
const voiceLoading = ref(false)

const voiceList = ref<VoiceModel[]>([])

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
      textRoleData.value = res.data.add_role || []
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
  // textVideoLoading.value = true
  console.log(category.currentProject, '内容')
  textSplitVisible.value = true
  textSplitData.value = [
    {
      textInfo: {
        plot: '在天空的尽头，有一间小小的云朵裁缝铺。',
        talk: {
          words: '',
          name: '',
        },
        desc: '场景位于天空尽头的高远空域，一间由蓬松白云构筑的小型裁缝铺静静悬浮于气流之中，周围弥漫着微光与稀薄水汽，时间处于永恒静谧的晨昏交界时刻。',
      },
      videoName: '在天空的尽头，有一间小小的云朵裁缝铺。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/3c87acc94f6c4ec7b58858cd95672b93.png',
      characterName: '',
    },
    {
      textInfo: {
        plot: '店主是一只年迈的白猫，名叫絮絮。它不缝衣服，而是用晨雾做线、晚霞当布，为伤心的人缝补破碎的梦。',
        talk: {
          words: '',
          name: '絮絮',
        },
        desc: '云朵裁缝铺内，一只毛色如初雪、眉宇间刻着细密皱纹的年迈白猫端坐于织云木台后；台面浮悬着半透明的晨雾纺线与流淌着金橙渐变光泽的晚霞布片；空间中漂浮着若隐若现的、由碎光组成的残缺梦境轮廓。',
      },
      videoName: '店主是一只年迈的白猫，名叫絮絮。它不缝衣服，而是用晨雾做线、晚霞当布，为伤心的人缝补破碎的梦。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/7fbca5fb3eaf45abbe12dc85353165dd.png',
      characterName: '絮絮',
    },
    {
      textInfo: {
        plot: '一天，一个小女孩坐在屋顶上哭泣。她的风筝断了线，飞进了乌云里，再也没回来。',
        talk: {
          words: '',
          name: '小女孩',
        },
        desc: '城市边缘一栋青瓦老屋的斜坡屋顶上，阳光微斜，风略带凉意；小女孩蜷坐在烟囱旁，双肩耸动，泪水滑落衣襟；一只纸扎蝴蝶形风筝正消失在远处低垂翻涌的铅灰色乌云边缘，细线在风中绷直后骤然断裂。',
      },
      videoName: '一天，一个小女孩坐在屋顶上哭泣。她的风筝断了线，飞进了乌云里，再也没回来。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/aa307fe35bbd425088d6de80ee57b283.png',
      characterName: '小女孩',
    },
    {
      textInfo: {
        plot: '那是妈妈最后送我的礼物……她抽泣着说。',
        talk: {
          words: '那是妈妈最后送我的礼物……',
          name: '小女孩',
        },
        desc: '小女孩仍坐在青瓦屋顶上，双手紧攥裙角，脸颊泪痕未干，声音断续哽咽；背景中乌云缓慢移动，屋檐滴落一滴积水。',
      },
      videoName: '那是妈妈最后送我的礼物……她抽泣着说。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/719e99e3b3e24fcea2f027b2842f4b37.png',
      characterName: '小女孩',
    },
    {
      textInfo: {
        plot: '絮絮轻轻跳上屋顶，从怀里掏出一团蓬松的云。',
        talk: {
          words: '',
          name: '絮絮',
        },
        desc: '白猫絮絮自天际轻盈跃下，四爪无声落在青瓦屋顶边缘，尾尖微翘，胸前绒毛间缓缓浮起一团柔光氤氲、边缘微微颤动的蓬松白云。',
      },
      videoName: '絮絮轻轻跳上屋顶，从怀里掏出一团蓬松的云。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/d280591804514afe89d2f4b6a9c8024d.png',
      characterName: '絮絮',
    },
    {
      textInfo: {
        plot: '别怕，我帮你把它缝回来。它用月光穿针，把星星缀在风筝的角上，又剪下一小片彩虹做尾巴。',
        talk: {
          words: '别怕，我帮你把它缝回来。',
          name: '絮絮',
        },
        desc: '絮絮立于屋顶中央，前爪托起一道凝练银辉化作的纤细月光之针；夜空背景悄然浮现，数粒冷蓝星芒自动吸附于风筝骨架四角；东南天际裂开一道微隙，一缕七彩光带被云剪裁下，柔顺垂落为风筝飘逸尾翼。',
      },
      videoName: '别怕，我帮你把它缝回来。它用月光穿针，把星星缀在风筝的角上，又剪下一小片彩虹做尾巴。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/a10f179fc0e6467d9595cc5242959799.png',
      characterName: '絮絮',
    },
    {
      textInfo: {
        plot: '第二天清晨，小女孩睁开眼——那只风筝正轻轻落在她的窗台上，比从前更亮、更轻，仿佛能带人飞到任何想念的地方。',
        talk: {
          words: '',
          name: '',
        },
        desc: '晨光初透的卧室中，浅蓝色窗帘微漾；小女孩躺在床上刚苏醒，睫毛轻颤；窗外透入淡金色天光，窗台木纹清晰可见，那只蝴蝶风筝静置其上，通体泛着珍珠母贝般的柔光，翅缘有细碎星点明灭，尾部彩虹丝带微微浮动。',
      },
      videoName: '第二天清晨，小女孩睁开眼——那只风筝正轻轻落在她的窗台上，比从前更亮、更轻，仿佛能带人飞到任何想念的地方。',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/5255715b031046b7afc25799c72309a8.png',
      characterName: '',
    },
    {
      textInfo: {
        plot: '从此，每当有人失落或难过，絮絮就会悄悄出现在他们梦里，问一句：需要我为你缝点什么吗？',
        talk: {
          words: '需要我为你缝点什么吗？',
          name: '絮絮',
        },
        desc: '多个模糊叠化的梦境场景交替闪现：不同年龄、性别的人物在各自睡颜中眉头微蹙；絮絮的身影如薄雾般浮现在每一场梦境深处，姿态安静，双眼映着微光；背景是流动的云絮、半隐的织机与飘散的星尘线头。',
      },
      videoName: '从此，每当有人失落或难过，絮絮就会悄悄出现在他们梦里，问一句：需要我为你缝点什么吗？',
      imageUrl: 'http://192.168.3.22:8000/view/videogen/4/plot/464f5955e2ae4dc4b318f1ac9b5b090b.png',
      characterName: '絮絮',
    },
  ]
  // textVideo({
  //   projectId: category.currentProject?.id,
  //   publishStatus: form.value.publishStatus,
  //   videoName: form.value.videoName,
  //   videoText: form.value.videoText,
  // }).then((res) => {
  //   console.log(res, '_res')
  // }).finally(() => {
  //   textVideoLoading.value = false
  // })
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

function test() {
  textRoleData.value = [
    {
      description: '一只年迈的白猫，毛发蓬松灰白相间，体型瘦小而优雅，眼睛呈淡金色，胡须长而微卷，颈部系着一条褪色的靛蓝丝巾，四肢纤细，尾巴尖略带弯钩，背景为白色。',
      posterUrl: 'https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/20/20260126/eb920ed5/4822b601-75e7-490a-ac3b-a5f03d93388a.png?Expires=1769494059&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=5EEk6fWggTOsBByv7G5h%2FLeVFXo%3D',
      characterName: '絮絮',
    },
    {
      description: '约七八岁的亚洲女孩，齐耳黑发略带自然卷，穿着浅黄色棉布连衣裙和白色短袜，脚上是一双红色小布鞋，脸颊微圆，皮肤白皙，双手抱着膝盖坐在屋顶边缘，背景为白色。',
      posterUrl: 'https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/1d/89/20260126/eb920ed5/e2334a75-e209-4f39-bdcd-dc490a5997dc.png?Expires=1769494058&OSSAccessKeyId=LTAI5tKPD3TMqf2Lna1fASuh&Signature=%2FTCiB%2BxC7SQsej9wwybiRbcPfGU%3D',
      characterName: '小女孩',
    },
  ]
  visible.value = true
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

onMounted(() => {
  voiceMethod()
})
</script>

<template>
  <div class="app-container ">
    <div class="card size-full">
      <div class="flex justify-between">
        <div>{{ isAdd ? "新增视频" : "编辑视频" }}</div>
        <el-button :icon="Back" @click="router.back()">
          返回
        </el-button>

        <el-button v-if="true" :icon="Back" @click="test">
          测试
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

    <TextSplitDialog v-model="textSplitVisible" :data="textSplitData" />
  </div>
</template>

<style scoped lang="scss">
</style>
