import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { HospitalDepositModel } from '../models/hospital-deposit.model';

@Injectable({ providedIn: 'root' })
export class HospitalDepositsService extends PocketBaseCrudService<HospitalDepositModel> {
  constructor(pb: PocketBase) {
    super(pb, 'deposits', 'id');
    this.modelClass = HospitalDepositModel;
    this.lazyExpand = 'sector, sector.floor, type';
  }
}
