import { Injectable, Type, inject } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { CrudTableService } from '@shared/interfaces/crud-service.interface';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { RecordsResponse } from '@shared/models/records-response.model';
import {
  ConfirmationService,
  LazyLoadEvent,
  MenuItem,
  MessageService,
} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {
  Observable,
  catchError,
  exhaustMap,
  forkJoin,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

export interface CrudTableState<Model> {
  menuItems: MenuItem[];
  loading: boolean;
  refresh: LazyLoadEvent;
  response: RecordsResponse<Model>;
  selection: Model[];
}

@Injectable()
export class CrudTableStore<Model extends CrudTableModel>
  extends ComponentStore<CrudTableState<Model>>
  implements OnStateInit
{
  readonly vm$ = this.select((state) => ({
    records: state.response.items,
    totalRecords: state.response.totalItems,
    loading: state.loading,
    menuItems: state.menuItems,
    deleteDisabled: state.selection.length === 0,
    selection: state.selection,
  }));

  public service!: CrudTableService<Model>;
  public modalComponent!: Type<any>;
  model!: CrudTableModel;

  protected confirmationService = inject(ConfirmationService);
  private dialogService = inject(DialogService);
  private messageService = inject(MessageService);

  ngrxOnStateInit() {
    this.model = new this.service.modelClass();
  }

  readonly selectionChange = this.effect((rows$: Observable<Model[]>) =>
    rows$.pipe(
      switchMap((selection) =>
        this.select((state) => state.menuItems).pipe(
          tap((menuItems) => {
            const deleteOptionIndex = menuItems.findIndex(
              (option) => option.id === 'delete'
            );
            if (deleteOptionIndex) {
              menuItems[deleteOptionIndex].disabled = selection.length === 0;
            }
            this.patchState({ selection, menuItems });
          })
        )
      )
    )
  );

  readonly refresh = this.effect((event$: Observable<LazyLoadEvent>) =>
    event$.pipe(
      switchMap((event) => {
        this.patchState({ loading: true });
        return this.service.listLazy(event).pipe(
          tapResponse(
            (response) =>
              this.patchState({ response, loading: false, refresh: event }),
            (e) => {
              this.error({
                summary: 'Error cargando los registros.',
                detail: this.service.handleError('list', e),
              });
              this.patchState({ loading: false });
            }
          )
        );
      })
    )
  );

  readonly openModal = this.effect((row$: Observable<Model | void>) =>
    row$.pipe(
      switchMap(
        (row) =>
          this.dialogService.open(this.modalComponent, {
            closeOnEscape: false,
            closable: false,
            header: `${
              row ? `Editar "${row.Label}"` : `Crear "${this.model.modelName}"`
            }`,
            data: row ? { id: row.Identity } : undefined,
          }).onClose
      ),
      tap((result) => {
        if (result) this.refresh(this.select((state) => state.refresh));
      })
    )
  );

  readonly deleteEffect = this.effect((row$: Observable<Model>) =>
    row$.pipe(
      exhaustMap((row) => {
        this.patchState({ loading: true });
        return this.service.delete(row).pipe(
          tapResponse(
            () => {
              this.success(`"${row.Label}" borrado con éxito`);
              this.refresh(this.select((state) => state.refresh));
            },
            (e) => {
              this.error({
                summary: `Error al borrar "${row.Label}".`,
                detail: this.service.handleError('delete', e),
              });
              this.patchState({ loading: false });
            }
          )
        );
      })
    )
  );

  readonly deleteSelectionEffect = this.effect((trigger$) =>
    trigger$.pipe(
      exhaustMap(() => this.select((state) => state.selection).pipe(take(1))),
      exhaustMap((rows) => {
        this.patchState({ loading: true, selection: [] });
        return forkJoin(
          rows.map((selected) =>
            this.service.delete(selected).pipe(
              tap((result) => {
                if (result)
                  this.success(`"${selected.Label}" borrado con éxito`);
              }),
              catchError((e) => {
                this.error({
                  summary: `Error borrando "${selected.Label}".`,
                  detail: this.service.handleError('delete', e),
                });
                return of(false);
              })
            )
          )
        );
      }),
      tap(() => {
        this.refresh(this.select((state) => state.refresh));
      })
    )
  );

  readonly success = this.effect((message$: Observable<string>) =>
    message$.pipe(
      tap((message) =>
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: message,
        })
      )
    )
  );

  readonly error = this.effect(
    (error$: Observable<{ summary: string; detail: string }>) =>
      error$.pipe(
        tap(({ summary, detail }) =>
          this.messageService.add({
            severity: 'error',
            life: 4500,
            summary: summary,
            detail: detail,
          })
        )
      )
  );

  delete(row: Model) {
    this.confirmationService.confirm({
      header: `Eliminar "${row.Label}"`,
      message: '¿Estás seguro de eliminar el registro?',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteEffect(row),
    });
  }

  deleteSelection() {
    const model = new this.service.modelClass();
    this.confirmationService.confirm({
      header: `Eliminar varios ${model.pluralName}`,
      message: '¿Estás seguro que querés eliminarlos?',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteSelectionEffect(),
    });
  }
}
