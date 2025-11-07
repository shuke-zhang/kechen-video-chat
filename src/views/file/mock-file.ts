// src/api/mock-file.ts
// ✅ 本地假数据 + 分页模拟 + 删除接口
// 注意：一行只写一条语句（满足你的 ESLint 规则）

export interface ListPage {
  current: number
  size: number
}

export interface ListPageParamsWrapper<T> {
  page: ListPage
  name?: string
  extra?: Partial<T>
}

export interface FileModel {
  id?: number
  name?: string
  typeName?: string
  typeId?: number
  fileType?: 0 | 1
  fileLink?: string
  fileContent?: string
  createdUserName?: string
  createdTime?: string
}

interface Resp<T> {
  data: T
}

const TYPE_POOL: Array<{ id: number, name: string }> = [
  { id: 11, name: '项目资料' },
  { id: 12, name: '多媒体' },
  { id: 13, name: '行政与合规' },
  { id: 14, name: '技术文档' },
  { id: 15, name: '归档' },
]

const USER_POOL: string[] = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '小明',
  '小红',
  '管理员',
]

const TOTAL_COUNT = 137

let DB: FileModel[] = []

function pad2(n: number): string {
  const s = String(n)
  return s.length >= 2 ? s : `0${s}`
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = pad2(d.getMonth() + 1)
  const dd = pad2(d.getDate())
  const hh = pad2(d.getHours())
  const mm = pad2(d.getMinutes())
  const ss = pad2(d.getSeconds())
  return `${y}-${m}-${dd} ${hh}:${mm}:${ss}`
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  const f = x - Math.floor(x)
  return f
}

function buildOnce(): void {
  if (DB.length > 0)
    return
  for (let i = 1; i <= TOTAL_COUNT; i += 1) {
    const r1 = seededRandom(i)
    const r2 = seededRandom(i + 1000)
    const r3 = seededRandom(i + 2000)
    const type = TYPE_POOL[Math.floor(r1 * TYPE_POOL.length)]
    const user = USER_POOL[Math.floor(r2 * USER_POOL.length)]
    const isUpload = r3 > 0.4
    const dayOffset = Math.floor(seededRandom(i + 3000) * 90)
    const date = new Date()
    date.setDate(date.getDate() - dayOffset)

    const item: FileModel = {}
    item.id = i
    item.name = isUpload ? `项目文件_${i}.docx` : `内容记录_${i}`
    item.typeId = type.id
    item.typeName = type.name
    item.fileType = isUpload ? 0 : 1
    item.fileLink = isUpload ? `files/demo-${i}.docx` : ''
    item.fileContent = isUpload ? '' : `这是一段示例内容，编号为 ${i}。`
    item.createdUserName = user
    item.createdTime = formatDate(date)

    DB.push(item)
  }
}

buildOnce()

export async function getFileList(
  params: ListPageParamsWrapper<FileModel>,
): Promise<Resp<{ records: FileModel[], total: number }>> {
  console.log(params, 'params')

  const page = params.page
  const kw = (params.name || '').trim()
  let list = DB
  if (kw.length > 0) {
    const low = kw.toLowerCase()
    list = list.filter((x) => {
      const a = (x.name || '').toLowerCase()
      return a.includes(low)
    })
  }
  const total = list.length
  const current = Math.max(1, Number(page.current || 1))
  const size = Math.max(1, Number(page.size || 10))
  const start = (current - 1) * size
  const end = start + size
  const pageList = list.slice(start, end)
  await waitMs(300)
  return {
    data: {
      records: pageList,
      total,
    },
  }
}

export async function DelFile(ids: number[]): Promise<Resp<boolean>> {
  const set = new Set(ids)
  DB = DB.filter(x => !set.has(x.id))
  await waitMs(200)
  return {
    data: true,
  }
}

function waitMs(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
