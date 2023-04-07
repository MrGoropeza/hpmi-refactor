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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalRoutingModule {}
