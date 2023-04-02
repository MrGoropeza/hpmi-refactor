import { Injectable, Type } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { CrudTableService } from '@shared/interfaces/crud-service.interface';
import { BaseModel } from '@shared/models/base.model';
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
  combineLatestWith,
  concatMap,
  exhaustMap,
  forkJoin,
  switchMap,
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
export class CrudTableStore<Model extends BaseModel> extends ComponentStore<
  CrudTableState<Model>
> {
  readonly vm$ = this.select((state) => ({
    records: state.response.items,
    totalRecords: state.response.totalItems,
    loading: state.loading,
    menuItems: state.menuItems,
    deleteDisabled: state.selection.length === 0,
  }));

  public service!: CrudTableService<Model>;
  public modalComponent!: Type<any>;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    super();
  }

  readonly selectionChange = this.effect((rows$: Observable<Model[]>) =>
    rows$.pipe(
      concatMap((selection) =>
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
        return this.service.listLazy(event);
      }),
      tapResponse(
        (response) => this.patchState({ response, loading: false }),
        () => {
          this.error('Error cargando los registros. Recargá la página.');
          this.patchState({ loading: false });
        }
      )
    )
  );

  readonly openModal = this.effect((row$: Observable<Model | void>) =>
    row$.pipe(
      exhaustMap(
        (row) =>
          this.dialogService.open(this.modalComponent, {
            closeOnEscape: false,
            closable: false,
            header: row ? `Editar Registro` : 'Crear Registro',
            data: row ? { id: row.id } : undefined,
          }).onClose
      ),
      combineLatestWith(this.select((state) => state.refresh)),
      tap(([result, refresh]) => {
        if (result) this.refresh(refresh);
      })
    )
  );

  delete(row: Model) {
    this.confirmationService.confirm({
      header: `Eliminar Registro`,
      message: '¿Estás seguro de eliminar el registro?',
      accept: () => this.deleteEffect(row),
    });
  }

  deleteSelection() {
    this.confirmationService.confirm({
      header: `Eliminar registros`,
      message: '¿Estás seguro que querés eliminar los registros?',
      accept: () => this.deleteSelectionEffect(),
    });
  }

  private readonly deleteEffect = this.effect((row$: Observable<Model>) =>
    row$.pipe(
      exhaustMap((row) => {
        this.patchState({ loading: true });
        return this.service.delete(row);
      }),
      tapResponse(
        () => {
          this.success('Registro borrado con éxito');
          this.refresh(this.select((state) => state.refresh));
        },
        () => {
          this.error('Error al borrar el registro. Intentá de nuevo.');
          this.patchState({ loading: false });
        }
      )
    )
  );

  private readonly deleteSelectionEffect = this.effect<void>((trigger$) =>
    trigger$.pipe(
      exhaustMap(() => this.select((state) => state.selection)),
      switchMap((rows) => {
        this.patchState({ selection: [] });
        return forkJoin(rows.map((selected) => this.service.delete(selected)));
      }),
      tapResponse(
        () => this.success('Registros borrados con éxito.'),
        () => this.error('Error al borrar los registros. Intentá de nuevo.')
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
