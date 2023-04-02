import { RecordsResponse } from '@shared/models/records-response.model';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

export interface CrudTableService<Model> {
  // list(page: number, perPage: number): Observable<RecordsResponse<Model>>;
  listAll(): Observable<Model[]>;
  listLazy(event: LazyLoadEvent): Observable<RecordsResponse<Model>>;
  get(id: string): Observable<Model>;
  create(data: Model): Observable<Model>;
  update(data: Model): Observable<Model>;
  delete(data: Model): Observable<boolean>;
}
