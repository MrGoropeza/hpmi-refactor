import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { PharmacyArticleModel } from '../models/pharmacy-article.model';

@Injectable({ providedIn: 'root' })
export class PharmacyArticlesService extends PocketBaseCrudService<PharmacyArticleModel> {
  constructor(pb: PocketBase) {
    super(pb, 'articles', 'name');
    this.modelClass = PharmacyArticleModel;
    this.lazyExpand = 'category';
  }
}
