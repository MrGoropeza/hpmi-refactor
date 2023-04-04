import { Injectable, Type } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse,
} from '@ngrx/component-store';
import { CrudTableService } from '@shared/interfaces/crud-service.interface';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { RecordsResponse } from '@shared/models/records-response.model';
import { LazyLoadEvent, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observable, exhaustMap, forkJoin, switchMap, tap } from 'rxjs';

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
  }));

  public service!: CrudTableService<Model>;
  public modalComponent!: Type<any>;
  model!: CrudTableModel;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService
  ) {
    super();
  }
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
              console.error(e);
              this.error('Error cargando los registros. Recargá la página.');
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
            () => {
              this.error(`Error al borrar "${row.Label}". Intentá de nuevo.`);
              this.patchState({ loading: false });
            }
          )
        );
      })
    )
  );

  readonly deleteSelectionEffect = this.effect((trigger$) =>
    trigger$.pipe(
      exhaustMap(() => this.select((state) => state.selection)),
      switchMap((rows) => {
        this.patchState({ loading: true });
        return forkJoin(rows.map((selected) => this.service.delete(selected)));
      }),
      tapResponse(
        () => {
          this.success(`${this.model.pluralName} borrados con éxito.`);
          this.patchState({ selection: [] });
        },
        () =>
          this.error(
            `Error borrando "${this.model.pluralName}". Intentá de nuevo.`
          )
      ),
      tap(() => this.refresh(this.select((state) => state.refresh)))
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

  readonly error = this.effect((message$: Observable<string>) =>
    message$.pipe(
      tap((message) =>
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: message,
        })
      )
    )
  );
}
