import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { Table, TableModule, TableService } from 'primeng/table';
import { HospitalFloorsService } from '../../data-access/hospital-floors.service';
import { HospitalFloorModel } from '../models/hospital-floor.model';
import { HospitalFloorsEditComponent } from './hospital-floors-edit.component';

@Component({
  selector: 'app-hospital-floors',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
  providers: [Table, TableService],
  templateUrl: './hospital-floors.component.html',
})
export class HospitalFloorsComponent {
  modalComponent = HospitalFloorsEditComponent;
  model = new HospitalFloorModel();
  service = inject(HospitalFloorsService);
}
