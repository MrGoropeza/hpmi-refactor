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
import { BaseModel } from '@shared/models/base.model';
import { CrudTableInjectorPipe } from '@shared/pipes/crud-table-injector.pipe';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';

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

interface CrudTableBodyContext<Model extends BaseModel> {
  $implicit: Model;
}

@Directive({ selector: 'ng-template[CrudTableBody]', standalone: true })
export class CrudTableBodyDirective<Model extends BaseModel> {
  @Input('CrudTableBody') model!: Model;

  static ngTemplateContextGuard<Model extends BaseModel>(
    dir: CrudTableBodyDirective<Model>,
    ctx: unknown
  ): ctx is CrudTableBodyContext<Model> {
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
  ],
  providers: [provideComponentStore(CrudTableStore)],
  templateUrl: './crud-table.component.html',
})
export class CrudTableComponent<Model extends BaseModel> implements OnInit {
  @ContentChild(CrudTableHeadersDirective, { read: TemplateRef })
  headersRef!: TemplateRef<any>;

  @ContentChild(CrudTableBodyDirective<Model>, { read: TemplateRef })
  bodyRef!: TemplateRef<any>;

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
      header: `Eliminar Registro`,
      message: '¿Estás seguro de eliminar el registro?',
      accept: () => this.store.deleteEffect(row),
    });
  }

  deleteSelection() {
    this.confirmationService.confirm({
      header: `Eliminar registros`,
      message: '¿Estás seguro que querés eliminar los registros?',
      accept: () => this.store.deleteSelectionEffect(),
    });
  }
}
