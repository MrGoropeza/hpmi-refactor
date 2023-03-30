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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyRoutingModule {}
