import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { Table, TableModule, TableService } from 'primeng/table';
import { PharmacyArticleCategoriesService } from '../../data-access/pharmacy-article-categories.service';
import { PharmacyArticleCategoryModel } from '../../models/pharmacy-article-category.model';
import { PharmacyArticleCategoriesEditComponent } from './pharmacy-article-categories-edit.component';

@Component({
  selector: 'app-pharmacy-article-categories',
  templateUrl: './pharmacy-article-categories.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
  providers: [Table, TableService],
})
export class PharmacyArticleCategoriesComponent {
  modalComponent = PharmacyArticleCategoriesEditComponent;
  model = new PharmacyArticleCategoryModel();
  constructor(protected service: PharmacyArticleCategoriesService) {}
}
