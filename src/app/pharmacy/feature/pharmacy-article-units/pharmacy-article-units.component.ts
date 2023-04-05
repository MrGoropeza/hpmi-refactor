import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { Table, TableModule, TableService } from 'primeng/table';
import { PharmacyArticleUnitsService } from '../../data-access/pharmacy-article-units.service';
import { PharmacyArticleUnitModel } from '../../models/pharmacy-article-unit.model';
import { PharmacyArticleUnitsEditComponent } from './pharmacy-article-units-edit.component';

@Component({
  selector: 'app-pharmacy-article-units',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
  providers: [Table, TableService],
  templateUrl: './pharmacy-article-units.component.html',
})
export class PharmacyArticleUnitsComponent {
  modalComponent = PharmacyArticleUnitsEditComponent;
  model = new PharmacyArticleUnitModel();
  constructor(protected service: PharmacyArticleUnitsService) {}
}
