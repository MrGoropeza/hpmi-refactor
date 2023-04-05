import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <p-button
      styleClass="p-button-info w-40 h-full flex-col justify-center gap-2"
      [routerLink]="menuItem.routerLink"
    >
      <i [ngClass]="menuItem.icon" class="text-8xl"></i>
      <span class="text-xl">{{ menuItem.label }}</span>
    </p-button>
  `,
})
export class MenuButtonComponent {
  @Input() menuItem!: MenuItem;
}
