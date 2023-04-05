import { CrudTableService } from '@shared/interfaces/crud-service.interface';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { RecordsResponse } from '@shared/models/records-response.model';
import PocketBase, {
  RecordFullListQueryParams,
  RecordQueryParams,
} from 'pocketbase';
import { FilterMatchMode, FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { Observable, from, map } from 'rxjs';

export interface ListOptions {
  page?: number;
  perPage?: number;
  queryParams?: RecordQueryParams;
}

const PrimeToPocketBaseMatchModes: { [s: string]: string } = {
  [FilterMatchMode.STARTS_WITH]: `~ "{value}%"`,
  [FilterMatchMode.ENDS_WITH]: `~ "%{value}"`,
  [FilterMatchMode.CONTAINS]: `~ "%{value}%"`,
  [FilterMatchMode.NOT_CONTAINS]: `!~ "%{value}%"`,
  [FilterMatchMode.EQUALS]: '= "{value}"',
  [FilterMatchMode.NOT_EQUALS]: '!= "{value}"',
  [FilterMatchMode.GREATER_THAN]: '>',
  [FilterMatchMode.GREATER_THAN_OR_EQUAL_TO]: '>=',
  [FilterMatchMode.LESS_THAN]: '<',
  [FilterMatchMode.LESS_THAN_OR_EQUAL_TO]: '<=',
  [FilterMatchMode.DATE_IS]: '= "{value}"',
  [FilterMatchMode.DATE_IS_NOT]: '!= "{value}"',
  [FilterMatchMode.DATE_BEFORE]: '< "{value}"',
  [FilterMatchMode.DATE_AFTER]: '> "{value}"',
};

export abstract class PocketBaseCrudService<Model extends CrudTableModel>
  implements CrudTableService<Model>
{
  modelClass = CrudTableModel;
  protected pbCollection = this.pb.collection(this.collectionName);
  lazyExpand = '';

  constructor(
    private pb: PocketBase,
    protected collectionName: string,
    protected searchProperty: string
  ) {}

  list(options: ListOptions): Observable<RecordsResponse<Model>> {
    return from(
      this.pbCollection.getList<Model>(
        options.page ?? 1,
        options.perPage ?? 30,
        options.queryParams ?? {}
      )
    ).pipe(
      map((response) => {
        response.items = response.items.map((item) =>
          Object.assign(new this.modelClass(), item)
        );
        return response;
      })
    );
  }

  listAll(queryParams?: RecordFullListQueryParams): Observable<Model[]> {
    return from(this.pbCollection.getFullList<Model>(queryParams)).pipe(
      map((items) =>
        items.map((item) => Object.assign(new this.modelClass(), item))
      )
    );
  }

  listLazy(event: LazyLoadEvent): Observable<RecordsResponse<Model>> {
    const options: ListOptions = {};
    if (event.first !== undefined && event.rows !== undefined) {
      options.page = event.first / event.rows + 1;
      options.perPage = event.rows;
    }

    const queryParams: RecordQueryParams = {};

    if (event.sortField !== undefined && event.sortOrder) {
      queryParams['sort'] = `${event.sortOrder === 1 ? '+' : '-'}${
        event.sortField
      }`;
    }

    if (event.filters !== undefined) {
      queryParams['filter'] = '';
      for (const filter of Object.entries(event.filters)) {
        const buildedFilter = this.buildPocketBaseFilter(
          filter[0],
          filter[1] instanceof Array ? filter[1] : [filter[1]]
        );
        if (queryParams['filter'] === '') {
          queryParams['filter'] += buildedFilter;
        } else {
          queryParams['filter'] += buildedFilter ? '&&' + buildedFilter : '';
        }
      }
    }
    queryParams.expand = this.lazyExpand;

    options.queryParams = queryParams;
    return this.list(options);
  }

  get(id: string, expand?: string): Observable<Model> {
    return from(this.pbCollection.getOne<Model>(id, { expand })).pipe(
      map((value) => Object.assign(new this.modelClass(), value))
    );
  }

  create(data: Model): Observable<Model> {
    return from(this.pbCollection.create<Model>(data)).pipe(
      map((value) => Object.assign(new this.modelClass(), value))
    );
  }

  update(data: Model): Observable<Model> {
    return from(this.pbCollection.update<Model>(data.Identity, data)).pipe(
      map((value) => Object.assign(new this.modelClass(), value))
    );
  }

  delete(data: Model): Observable<boolean> {
    return from(this.pbCollection.delete(data.Identity));
  }

  private buildPocketBaseFilter(
    propertyName: string,
    filters: FilterMetadata[]
  ): string {
    let result = '(';

    for (const filter of filters) {
      const pocketbaseMatchMode =
        PrimeToPocketBaseMatchModes[filter.matchMode ?? 'equals'];

      const hasPlaceholder = pocketbaseMatchMode.includes('{value}');

      if (hasPlaceholder && filter.value === null) continue;

      propertyName =
        propertyName === 'global' ? this.searchProperty : propertyName;

      if (filter.value instanceof Date) {
        filter.value = filter.value.toISOString();
      } else if (typeof filter.value === 'string' && !hasPlaceholder) {
        filter.value = `"${filter.value}"`;
      }

      if (filter.operator === 'and') {
        filter.operator = '&&';
      } else if (filter.operator === 'or') {
        filter.operator = '||';
      }

      const buildedFilter =
        filter.value !== undefined
          ? `${propertyName}${
              hasPlaceholder
                ? pocketbaseMatchMode.replace('{value}', filter.value ?? '')
                : pocketbaseMatchMode
            }${!hasPlaceholder ? filter.value : ''}`
          : '';

      if (buildedFilter === '') continue;

      if (result === '(') {
        result += buildedFilter;
      } else {
        result += filter.operator + buildedFilter;
      }
    }

    return result !== '(' ? result + ')' : '';
  }
}
