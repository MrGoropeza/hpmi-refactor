import { CrudTableModel } from '@shared/models/crud-table.model';
import { RecordsResponse } from '@shared/models/records-response.model';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';

export interface CrudTableService<Model extends CrudTableModel> {
  modelClass: typeof CrudTableModel;

  listAll(): Observable<Model[]>;
  listLazy(event: LazyLoadEvent): Observable<RecordsResponse<Model>>;
  get(id: string): Observable<Model>;
  create(data: Model): Observable<Model>;
  update(data: Model): Observable<Model>;
  delete(data: Model): Observable<boolean>;
}
