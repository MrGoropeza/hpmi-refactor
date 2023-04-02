import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CrudTableSortButtonComponent } from '@shared/ui/crud-table-sort-button/crud-table-sort-button.component';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { PharmacyArticlesService } from '../../data-access/pharmacy-articles.service';
import { PharmacyArticlesEditComponent } from './pharmacy-articles-edit.component';

@Component({
  selector: 'app-pharmacy-articles',
  standalone: true,
  templateUrl: './pharmacy-articles.component.html',
  imports: [
    CommonModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
    CrudTableSortButtonComponent,
  ],
})
export class PharmacyArticlesComponent {
  modalComponent = PharmacyArticlesEditComponent;
  constructor(protected articlesService: PharmacyArticlesService) {}
}
