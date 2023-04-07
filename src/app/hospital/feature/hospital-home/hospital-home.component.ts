import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getActualMenuItems } from '@shared/config/menu.config';
import { MenuButtonComponent } from '@shared/ui/menu-button/menu-button.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-hospital-home',
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
export class HospitalHomeComponent {
  menuItems: MenuItem[] = getActualMenuItems(this.router.url);
  constructor(private router: Router) {}
}
