import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Hospital',
    data: { breadcrumb: 'Inicio' },
    loadComponent: () =>
      import('../hospital-home/hospital-home.component').then(
        (c) => c.HospitalHomeComponent
      ),
  },
  {
    path: 'floors',
    title: 'Plantas',
    data: { breadcrumb: 'Plantas' },
    loadComponent: () =>
      import('../hospital-floors/hospital-floors.component').then(
        (c) => c.HospitalFloorsComponent
      ),
  },
  {
    path: 'sectors',
    title: 'Sectores',
    data: { breadcrumb: 'Sectores' },
    loadComponent: () =>
      import('../hospital-sectors/hospital-sectors.component').then(
        (c) => c.HospitalSectorsComponent
      ),
  },
  {
    path: 'deposits',
    title: 'Depósitos',
    data: { breadcrumb: 'Depósitos' },
    loadComponent: () =>
      import('../hospital-deposits/hospital-deposits.component').then(
        (c) => c.HospitalDepositsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalRoutingModule {}
