import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { Table, TableModule, TableService } from 'primeng/table';
import { HospitalSectorsService } from '../../data-access/hospital-sectors.service';
import { HospitalSectorModel } from '../models/hospital-sector.model';
import { HospitalSectorsEditComponent } from './hospital-sectors-edit.component';

@Component({
  selector: 'app-hospital-sectors',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
  providers: [Table, TableService],
  templateUrl: './hospital-sectors.component.html',
})
export class HospitalSectorsComponent {
  modalComponent = HospitalSectorsEditComponent;
  model = new HospitalSectorModel();
  service = inject(HospitalSectorsService);
}
