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

  constructor(protected readonly store: CrudTableStore<Model>) {}

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
          command: () => this.store.deleteSelection(),
        },
      ],
      refresh: {},
      response: {},
      selection: [],
    });
  }
}
