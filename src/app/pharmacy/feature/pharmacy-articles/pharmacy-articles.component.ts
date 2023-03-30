import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SpeedDialModule } from 'primeng/speeddial';
import { TableModule } from 'primeng/table';
import {
  BehaviorSubject,
  interval,
  map,
  Observable,
  of,
  Subject,
  take,
} from 'rxjs';

@Component({
  selector: 'app-pharmacy-articles',
  standalone: true,
  templateUrl: './pharmacy-articles.component.html',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    TableModule,
    SpeedDialModule,
    MenuModule,
  ],
})
export class PharmacyArticlesComponent {
  values$ = new Subject<any[]>();
  totalRecords$: Observable<number> = of(0);
  loading$ = new BehaviorSubject<boolean>(false);
  deleteDisabled$ = new BehaviorSubject<boolean>(true);
  menuItems$: Observable<MenuItem[]> = this.deleteDisabled$.pipe(
    map((deleteDisabled): MenuItem[] => {
      return [
        {
          icon: 'pi pi-plus',
          label: 'Agregar',
          command: () => {},
        },
        {
          icon: 'pi pi-trash',
          label: 'Borrar',
          disabled: deleteDisabled,
          command: () => {},
        },
      ];
    })
  );

  constructor() {}

  onLazyLoad(event: LazyLoadEvent) {
    console.log(event);

    this.loading$.next(true);
    interval(1000)
      .pipe(take(1))
      .subscribe(() => {
        this.totalRecords$ = of(10);
        this.values$.next(
          Array(10).fill({
            id: 20,
            name: 'nombre',
            description: 'desc',
            category: 'category',
            dueDate: Date.now(),
          })
        );
        this.loading$.next(false);
      });
  }
}
