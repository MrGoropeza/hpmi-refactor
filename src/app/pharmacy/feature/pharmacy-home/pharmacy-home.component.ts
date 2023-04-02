import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { getActualMenuItems } from 'src/app/shared/config/menu.config';
import { MenuButtonComponent } from 'src/app/shared/ui/menu-button/menu-button.component';

@Component({
  selector: 'app-pharmacy-home',
  standalone: true,
  imports: [CommonModule, MenuButtonComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-4">
      <app-menu-button
        *ngFor="let item of menuItems"
        [menuItem]="item"
      ></app-menu-button>
    </div>
  `,
})
export class PharmacyHomeComponent {
  menuItems: MenuItem[] = getActualMenuItems(this.router.url);
  constructor(private router: Router) {}
}
