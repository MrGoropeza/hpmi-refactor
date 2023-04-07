import { MenuItem } from 'primeng/api';

const ignore = 'title';

export const MENU_CONFIG: MenuItem[] = [
  {
    label: 'Hospital Materno Infantil',
    styleClass: 'text-lg',
    icon: 'bi bi-hospital-fill',
    routerLink: '/',
  },
  {
    label: 'Hospital',
    icon: 'bi bi-hospital',
    items: [
      { id: ignore, label: 'Hospital', disabled: true },
      {
        id: ignore,
        label: 'Inicio',
        icon: 'pi pi-home',
        routerLink: '/hospital',
      },
      {
        label: 'Plantas',
        icon: 'bi bi-layers',
        routerLink: '/hospital/floors',
      },
      {
        label: 'Sectores',
        icon: 'bi bi-inboxes',
        routerLink: '/hospital/sectors',
      },
      {
        label: 'Depósitos',
        icon: 'bi bi-box-seam',
        routerLink: '/hospital/deposits',
      },
    ],
  },
  {
    label: 'Farmacia',
    icon: 'bi bi-bandaid',
    items: [
      { id: ignore, label: 'Farmacia', disabled: true },
      {
        id: ignore,
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
    ],
  },
];

export function getActualMenuItems(
  routerLink: string,
  menuConfig: MenuItem[] = MENU_CONFIG
): MenuItem[] {
  for (const item of menuConfig) {
    if (item.routerLink && item.routerLink === routerLink)
      return menuConfig.filter((item) => item.id !== ignore);

    if (
      item.items &&
      item.items.find((value) => value.routerLink === routerLink)
    )
      return getActualMenuItems(routerLink, item.items);
  }

  return [];
}
