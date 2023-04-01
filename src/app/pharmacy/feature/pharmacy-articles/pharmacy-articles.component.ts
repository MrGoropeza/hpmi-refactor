import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SpeedDialModule } from 'primeng/speeddial';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, Observable, map, skip, switchMap, tap } from 'rxjs';
import {
  MultipleRecordsResponse,
  PharmacyArticlesService,
} from '../../data-access/pharmacy-articles.service';
import { PharmacyArticleModel } from '../../models/pharmacy-article.model';

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
  refresh$ = new BehaviorSubject<LazyLoadEvent>({});
  loading$ = new BehaviorSubject<boolean>(false);
  selection$ = new BehaviorSubject<PharmacyArticleModel[]>([]);

  response$: Observable<MultipleRecordsResponse<PharmacyArticleModel>> =
    this.refresh$.pipe(
      skip(1),
      tap(() => this.loading$.next(true)),
      switchMap((event) => this.articlesService.listLazy(event)),
      tap(() => this.loading$.next(false))
    );

  menuItems$: Observable<MenuItem[]> = this.selection$.pipe(
    map((selection): MenuItem[] => {
      return [
        {
          icon: 'pi pi-plus',
          label: 'Agregar',
          command: () => {},
        },
        {
          icon: 'pi pi-trash',
          label: 'Borrar',
          disabled: selection.length === 0,
          command: () => {},
        },
      ];
    })
  );

  constructor(private articlesService: PharmacyArticlesService) {}
}
