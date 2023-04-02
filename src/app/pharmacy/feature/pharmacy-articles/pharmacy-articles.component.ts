import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  Observable,
  map,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  MultipleRecordsResponse,
  PharmacyArticlesService,
} from '../../data-access/pharmacy-articles.service';
import { PharmacyArticleModel } from '../../models/pharmacy-article.model';
import { PharmacyArticlesEditComponent } from './pharmacy-articles-edit.component';

@Component({
  selector: 'app-pharmacy-articles',
  standalone: true,
  templateUrl: './pharmacy-articles.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    MenuModule,
    DynamicDialogModule,
  ],
})
export class PharmacyArticlesComponent {
  refresh$ = new BehaviorSubject<LazyLoadEvent>({});
  loading$ = new BehaviorSubject<boolean>(false);
  selection$ = new BehaviorSubject<PharmacyArticleModel[]>([]);

  response$: Observable<MultipleRecordsResponse<PharmacyArticleModel>> =
    this.refresh$.pipe(
      skip(1),
      tap(() => this.loading$.next(true)),
      switchMap((event) => this.articlesService.listLazy(event)),
      tap(() => this.loading$.next(false))
    );

  menuItems$: Observable<MenuItem[]> = this.selection$.pipe(
    map((selection): MenuItem[] => {
      return [
        {
          id: 'create',
          icon: 'pi pi-plus',
          label: 'Agregar',
          command: () => this.openModal(),
        },
        {
          id: 'deleteMultiple',
          icon: 'pi pi-trash',
          label: 'Borrar',
          disabled: selection.length === 0,
          command: () => {},
        },
      ];
    })
  );

  constructor(
    private articlesService: PharmacyArticlesService,
    private dialogService: DialogService
  ) {}

  openModal(row?: PharmacyArticleModel) {
    const modal = this.dialogService.open(PharmacyArticlesEditComponent, {
      closeOnEscape: false,
      closable: false,
      header: row ? `Editar ${row.name}` : 'Agregar Artículo',
      data: row ? { id: row.id } : undefined,
    });

    modal.onClose.pipe(take(1)).subscribe((result) => {
      if (result) this.refresh$.next(this.refresh$.value);
    });
  }

  delete(row: PharmacyArticleModel) {}
}
