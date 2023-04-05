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
      { label: 'Farmacia', disabled: true },
      {
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/pharmacy',
      },
      {
        label: 'Artículos',
        icon: 'bi bi-boxes',
        routerLink: '/pharmacy/articles',
      },
      {
        label: 'Categorías de Artículos',
        icon: 'bi bi-tags',
        routerLink: '/pharmacy/article-categories',
      },
      {
        label: 'Unidades de Artículos',
        icon: 'bi bi-box',
        routerLink: '/pharmacy/article-units',
      },
      {
        label: 'Depósitos',
        icon: 'bi bi-box-seam',
        routerLink: '/pharmacy/deposits',
      },
    ],
  },
];

export function getActualMenuItems(
  routerLink: string,
  menuConfig: MenuItem[] = MENU_CONFIG
): MenuItem[] {
  for (const item of menuConfig) {
    if (item.routerLink && item.routerLink === routerLink)
      return menuConfig.slice(2);

    if (item.items) return getActualMenuItems(routerLink, item.items);
  }

  return [];
}
