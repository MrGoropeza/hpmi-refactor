import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { PharmacyArticleCategoryModel } from '../models/pharmacy-article-category.model';

@Injectable({ providedIn: 'root' })
export class PharmacyArticleCategoriesService extends PocketBaseCrudService<PharmacyArticleCategoryModel> {
  constructor(pb: PocketBase) {
    super(pb, 'article_categories', 'name');
    this.modelClass = PharmacyArticleCategoryModel;
  }
}
