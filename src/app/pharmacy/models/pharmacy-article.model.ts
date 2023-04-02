import { BaseModel } from '@shared/models/base.model';

export class PharmacyArticleModel extends BaseModel {
  created?: Date;
  updated?: Date;
  name?: string;
  description?: string;
  dueDate?: Date;
}
