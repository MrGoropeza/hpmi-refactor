import { Injector, Pipe, PipeTransform } from '@angular/core';
import { Table } from 'primeng/table';

@Pipe({
  name: 'crudTableInjector',
  standalone: true,
})
export class CrudTableInjectorPipe implements PipeTransform {
  transform(table: Table): Injector {
    return Injector.create({
      providers: [{ provide: Table, useValue: table }],
    });
  }
}
