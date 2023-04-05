import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Farmacia',
    data: { breadcrumb: 'Inicio' },
    loadComponent: () =>
      import('../pharmacy-home/pharmacy-home.component').then(
        (c) => c.PharmacyHomeComponent
      ),
  },
  {
    path: 'articles',
    title: 'Artículos de Farmacia',
    data: { breadcrumb: 'Artículos' },
    loadComponent: () =>
      import('../pharmacy-articles/pharmacy-articles.component').then(
        (c) => c.PharmacyArticlesComponent
      ),
  },
  {
    path: 'article-categories',
    title: 'Categorías de Artículos',
    data: { breadcrumb: 'Categorías de Artículos' },
    loadComponent: () =>
      import(
        '../pharmacy-article-categories/pharmacy-article-categories.component'
      ).then((c) => c.PharmacyArticleCategoriesComponent),
  },
  {
    path: 'article-units',
    title: 'Unidades de Artículos',
    data: { breadcrumb: 'Unidades de Artículos' },
    loadComponent: () =>
      import('../pharmacy-article-units/pharmacy-article-units.component').then(
        (c) => c.PharmacyArticleUnitsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyRoutingModule {}
