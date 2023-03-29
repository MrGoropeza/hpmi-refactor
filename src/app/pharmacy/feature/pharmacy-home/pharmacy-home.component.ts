import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { getActualMenuItems } from 'src/app/shared/config/menu.config';
import { MenuButtonComponent } from 'src/app/shared/ui/menu-button/menu-button.component';

@Component({
  selector: 'app-pharmacy-home',
  standalone: true,
  imports: [CommonModule, MenuButtonComponent],
  styleUrls: ['./pharmacy-home.component.scss'],
  template: `
    <div class="flex flex-wrap justify-center gap-4">
      <app-menu-button
        *ngFor="let item of menuItems"
        [menuItem]="item"
      ></app-menu-button>
    </div>
  `,
})
export class PharmacyHomeComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.menuItems = getActualMenuItems(this.router.url);
  }
}
