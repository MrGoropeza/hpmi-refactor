import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/ui/main-layout/main-layout.component';

export const APP_ROUTES: Routes = [
  {
    path: 'pharmacy',
    data: { breadcrumb: 'Farmacia' },
    loadChildren: () =>
      import(
        './pharmacy/feature/pharmacy-routing/pharmacy-routing.module'
      ).then((m) => m.PharmacyRoutingModule),
  },
];

@Component({
  selector: 'app-root',
  template: `
    <app-main-layout>
      <router-outlet></router-outlet>
    </app-main-layout>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, MainLayoutComponent],
})
export class AppComponent {}
