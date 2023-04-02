import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CrudTableBodyDirective,
  CrudTableComponent,
  CrudTableHeadersDirective,
} from '@shared/ui/crud-table/crud-table.component';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { PharmacyArticlesService } from '../../data-access/pharmacy-articles.service';
import { PharmacyArticlesEditComponent } from './pharmacy-articles-edit.component';

@Component({
  selector: 'app-pharmacy-articles',
  standalone: true,
  templateUrl: './pharmacy-articles.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    MenuModule,
    CrudTableComponent,
    CrudTableHeadersDirective,
    CrudTableBodyDirective,
  ],
})
export class PharmacyArticlesComponent {
  modalComponent = PharmacyArticlesEditComponent;
  constructor(protected articlesService: PharmacyArticlesService) {}
}
