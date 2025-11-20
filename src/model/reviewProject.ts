import type { DictLabelModel } from './dict'

export interface ReviewProjectModel {

}

export interface GetLabelResponse {
  fileType: DictLabelModel[]
  position: DictLabelModel[]
}
