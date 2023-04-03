import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { Table, TableModule, TableService } from 'primeng/table';
import { PharmacyArticlesService } from '../../data-access/pharmacy-articles.service';
import { PharmacyArticleModel } from '../../models/pharmacy-article.model';
import { PharmacyArticlesEditComponent } from './pharmacy-articles-edit.component';

@Component({
  selector: 'app-pharmacy-articles',
  standalone: true,
  templateUrl: './pharmacy-articles.component.html',
  imports: [
    CommonModule,
    TableModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
  providers: [Table, TableService],
})
export class PharmacyArticlesComponent {
  modalComponent = PharmacyArticlesEditComponent;
  model = new PharmacyArticleModel();
  constructor(protected articlesService: PharmacyArticlesService) {}
}
