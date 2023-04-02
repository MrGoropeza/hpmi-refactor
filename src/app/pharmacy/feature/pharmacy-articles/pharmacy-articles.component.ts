import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  Observable,
  catchError,
  forkJoin,
  map,
  of,
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
      catchError(() => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error cargando los registros. Recargá la página.`,
        });

        return of({});
      }),
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
          command: () => this.deleteSelection(),
        },
      ];
    })
  );

  constructor(
    private articlesService: PharmacyArticlesService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  delete(row: PharmacyArticleModel) {
    this.confirmationService.confirm({
      header: `Eliminar "${row.name}"`,
      message: '¿Estás seguro de eliminar el registro?',
      accept: () => {
        this.articlesService
          .delete(row)
          .pipe(take(1))
          .subscribe({
            complete: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `"${row.name}" borrado con éxito.`,
              });
              this.refresh$.next(this.refresh$.value);
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Error al borrar "${row.name}". Intentá de nuevo.`,
              });
              this.loading$.next(false);
            },
          });
      },
    });
  }

  deleteSelection() {
    this.confirmationService.confirm({
      header: `Eliminar ${this.selection$.value.length} registros`,
      message: '¿Estás seguro que querés eliminar los registros?',
      accept: () => {
        this.loading$.next(true);

        const deleteOperations = this.selection$.value.map((selected) =>
          this.articlesService.delete(selected)
        );
        this.selection$.next([]);

        forkJoin(deleteOperations).subscribe({
          complete: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Registros borrados con éxito.`,
            });
            this.refresh$.next(this.refresh$.value);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Error al borrar los registros. Intentá de nuevo.`,
            });
            this.refresh$.next(this.refresh$.value);
          },
        });
      },
    });
  }
}
