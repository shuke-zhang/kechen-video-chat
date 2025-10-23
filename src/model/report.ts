export interface ReportModel {
  id?: number
  patientId?: number
  patientName?: string
  reportType?: string // 报告类型：影像/检验/病理等
  reportDate?: string // YYYY-MM-DD HH:mm:ss
  doctor?: string
  status?: '草稿' | '已出具' | '作废'
  findings?: string // 所见
  impression?: string // 结论/印象
  attachments?: string[] // 附件URL
}
