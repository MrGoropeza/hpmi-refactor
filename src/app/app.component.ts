import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
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

    <p-confirmDialog></p-confirmDialog>
    <p-toast></p-toast>
  `,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MainLayoutComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [DialogService, ConfirmationService, MessageService],
})
export class AppComponent implements OnInit {
  constructor(private primeConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeConfig.setTranslation(primeLanguageES);
  }
}
