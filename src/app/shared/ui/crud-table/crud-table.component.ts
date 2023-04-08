import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  Type,
} from '@angular/core';
import { LetModule } from '@ngrx/component';
import { provideComponentStore } from '@ngrx/component-store';
import { CrudTableStore } from '@shared/data-access/crud-table.store';
import { CrudTableService } from '@shared/interfaces/crud-service.interface';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { CrudTableInjectorPipe } from '@shared/pipes/crud-table-injector.pipe';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';
import { CrudTableActionButtonComponent } from '../crud-table-action-button/crud-table-action-button.component';

interface CrudTableHeadersContext {
  $implicit: Table;
}

@Directive({ selector: 'ng-template[CrudTableHeaders]', standalone: true })
export class CrudTableHeadersDirective {
  static ngTemplateContextGuard(
    dir: CrudTableHeadersDirective,
    ctx: unknown
  ): ctx is CrudTableHeadersContext {
    return true;
  }
}

interface CrudTableBodyContext<Model extends CrudTableModel> {
  $implicit: Model;
}

@Directive({ selector: 'ng-template[CrudTableBody]', standalone: true })
export class CrudTableBodyDirective<Model extends CrudTableModel> {
  @Input('CrudTableBody') model!: Model;

  static ngTemplateContextGuard<Model extends CrudTableModel>(
    dir: CrudTableBodyDirective<Model>,
    ctx: unknown
  ): ctx is CrudTableBodyContext<Model> {
    return true;
  }
}

interface CrudTableRowActionsContext<Model extends CrudTableModel> {
  $implicit: Model;
}

@Directive({ selector: 'ng-template[CrudTableRowActions]', standalone: true })
export class CrudTableRowActionsDirective<Model extends CrudTableModel> {
  @Input('CrudTableRowActions') model!: Model;

  static ngTemplateContextGuard<Model extends CrudTableModel>(
    dir: CrudTableRowActionsDirective<Model>,
    ctx: unknown
  ): ctx is CrudTableRowActionsContext<Model> {
    return true;
  }
}

@Component({
  selector: 'crud-table',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    MenuModule,
    CrudTableInjectorPipe,
    CrudTableActionButtonComponent,
  ],
  providers: [provideComponentStore(CrudTableStore)],
  templateUrl: './crud-table.component.html',
})
export class CrudTableComponent<Model extends CrudTableModel>
  implements OnInit
{
  @ContentChild(CrudTableHeadersDirective, { read: TemplateRef })
  headersRef!: TemplateRef<any>;

  @ContentChild(CrudTableBodyDirective<Model>, { read: TemplateRef })
  bodyRef!: TemplateRef<any>;

  @ContentChild(CrudTableRowActionsDirective<Model>, { read: TemplateRef })
  actionsRef!: TemplateRef<any>;

  @Input() modalComponent!: Type<any>;
  @Input() service!: CrudTableService<Model>;

  constructor(
    protected readonly store: CrudTableStore<Model>,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.store.modalComponent = this.modalComponent;
    this.store.service = this.service;
    this.store.setState({
      loading: false,
      menuItems: [
        {
          id: 'create',
          icon: 'pi pi-plus',
          label: 'Agregar',
          command: () => this.store.openModal(),
        },
        {
          id: 'delete',
          icon: 'pi pi-trash',
          label: 'Borrar',
          disabled: true,
          command: () => this.deleteSelection(),
        },
      ],
      refresh: {},
      response: {},
      selection: [],
    });
  }

  delete(row: Model) {
    this.confirmationService.confirm({
      header: `Eliminar "${row.Label}"`,
      message: '¿Estás seguro de eliminar el registro?',
      accept: () => this.store.deleteEffect(row),
    });
  }

  deleteSelection() {
    const model = new this.service.modelClass();
    this.confirmationService.confirm({
      header: `Eliminar varios ${model.pluralName}`,
      message: '¿Estás seguro que querés eliminarlos?',
      accept: () => this.store.deleteSelectionEffect(),
    });
  }
}
