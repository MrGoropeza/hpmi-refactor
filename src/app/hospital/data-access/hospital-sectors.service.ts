import { Injectable } from '@angular/core';
import { PocketBaseCrudService } from '@shared/data-access/crud-pocketbase.service';
import PocketBase from 'pocketbase';
import { HospitalSectorModel } from '../models/hospital-sector.model';

@Injectable({
  providedIn: 'root',
})
export class HospitalSectorsService extends PocketBaseCrudService<HospitalSectorModel> {
  constructor(pb: PocketBase) {
    super(pb, 'sectors', 'name');
    this.modelClass = HospitalSectorModel;
    this.lazyExpand = 'floor';
  }
}
