import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { PharmacyArticleUnitModel } from '../models/pharmacy-article-unit.model';

@Injectable({ providedIn: 'root' })
export class PharmacyArticleUnitsService extends PocketBaseCrudService<PharmacyArticleUnitModel> {
  constructor(pb: PocketBase) {
    super(pb, 'article_units', 'abreviation');
    this.modelClass = PharmacyArticleUnitModel;
  }
}
