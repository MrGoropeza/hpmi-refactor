import { MenuItem } from 'primeng/api';

export const MENU_CONFIG: MenuItem[] = [
  {
    label: 'Hospital Materno Infantil',
    styleClass: 'text-lg',
    icon: 'bi bi-hospital-fill',
    routerLink: '/',
  },
  {
    label: 'Farmacia',
    icon: 'bi bi-bandaid',
    items: [
      {
        label: 'Farmacia',
        disabled: true,
      },
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/pharmacy',
      },
      { label: 'Artículos', routerLink: 'pharmacy/articles' },
      { label: 'Depósitos', routerLink: 'pharmacy/deposits' },
    ],
  },
];
