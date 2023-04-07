import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { HospitalFloorModel } from '../models/hospital-floor.model';

@Injectable({ providedIn: 'root' })
export class HospitalFloorsService extends PocketBaseCrudService<HospitalFloorModel> {
  constructor(pb: PocketBase) {
    super(pb, 'floors', 'name');
    this.modelClass = HospitalFloorModel;
  }
}
