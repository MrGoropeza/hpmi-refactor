import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { Table, TableModule, TableService } from 'primeng/table';
import { HospitalDepositsService } from '../../data-access/hospital-deposits.service';
import { HospitalDepositModel } from '../../models/hospital-deposit.model';
import { HospitalDepositsEditComponent } from './hospital-deposits-edit.component';

@Component({
  selector: 'app-hospital-deposits',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
  providers: [Table, TableService],
  templateUrl: './hospital-deposits.component.html',
})
export class HospitalDepositsComponent {
  modalComponent = HospitalDepositsEditComponent;
  model = new HospitalDepositModel();
  service = inject(HospitalDepositsService);
}
