import { Injectable } from '@angular/core';
import { CrudTableService } from '@shared/interfaces/crud-service.interface';
import { RecordsResponse } from '@shared/models/records-response.model';
import PocketBase, { RecordQueryParams } from 'pocketbase';
import { FilterMatchMode, FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { Observable, from } from 'rxjs';
import { PharmacyArticleModel } from '../models/pharmacy-article.model';

interface ListOptions {
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
@Injectable({ providedIn: 'root' })
export class PharmacyArticlesService
  implements CrudTableService<PharmacyArticleModel>
{
  private pbCollection = this.pb.collection('articles');
  searchProperty = 'name';

  constructor(private pb: PocketBase) {}

  listAll(): Observable<PharmacyArticleModel[]> {
    return from(this.pbCollection.getFullList<PharmacyArticleModel>());
  }

  list(
    options: ListOptions
  ): Observable<RecordsResponse<PharmacyArticleModel>> {
    return from(
      this.pbCollection.getList<PharmacyArticleModel>(
        options.page ?? 1,
        options.perPage ?? 30,
        options.queryParams ?? {}
      )
    );
  }

  get(id: string, expand?: string): Observable<PharmacyArticleModel> {
    return from(this.pbCollection.getOne<PharmacyArticleModel>(id, { expand }));
  }

  create(data: PharmacyArticleModel): Observable<PharmacyArticleModel> {
    return from(this.pbCollection.create<PharmacyArticleModel>(data));
  }

  update(data: PharmacyArticleModel): Observable<PharmacyArticleModel> {
    return from(this.pbCollection.update<PharmacyArticleModel>(data.id, data));
  }

  delete(data: PharmacyArticleModel): Observable<boolean> {
    return from(this.pbCollection.delete(data.id));
  }

  listLazy(
    event: LazyLoadEvent
  ): Observable<RecordsResponse<PharmacyArticleModel>> {
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

    options.queryParams = queryParams;
    return this.list(options);
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
