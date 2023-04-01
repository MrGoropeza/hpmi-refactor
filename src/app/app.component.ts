import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { primeLanguageES } from './shared/consts/prime-language-ES';
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
export class AppComponent implements OnInit {
  constructor(private primeConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeConfig.setTranslation(primeLanguageES);
  }
}
