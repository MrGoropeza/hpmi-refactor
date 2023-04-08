import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { HospitalDepositTypeModel } from '../models/hospital-deposit-type.model';

@Injectable({ providedIn: 'root' })
export class HospitalDepositTypesService extends PocketBaseCrudService<HospitalDepositTypeModel> {
  constructor(pb: PocketBase) {
    super(pb, 'deposit_types', 'name');
    this.modelClass = HospitalDepositTypeModel;
  }
}
