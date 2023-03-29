import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Inicio' },
    loadComponent: () =>
      import('../pharmacy-home/pharmacy-home.component').then(
        (c) => c.PharmacyHomeComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyRoutingModule {}
