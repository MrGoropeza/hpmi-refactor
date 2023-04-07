import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ThemeService } from '@shared/data-access/theme.service';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MegaMenuModule } from 'primeng/megamenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { Observable, filter, map, of, switchMap } from 'rxjs';
import { MENU_CONFIG } from '../../config/menu.config';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BreadcrumbModule,
    CardModule,
    MegaMenuModule,
    SlideMenuModule,
  ],
})
export class MainLayoutComponent {
  breadcrumbItems$: Observable<MenuItem[]> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() =>
      of(
        this.createBreadcrumbs(this.activatedRoute, this.activatedRoute.root, [
          { icon: 'pi pi-home', routerLink: '/' },
        ])
      )
    )
  );

  cardHeader$: Observable<string> = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    switchMap(() =>
      this.getActualActivatedRoute(this.activatedRoute).title.pipe(
        map((value) => value ?? '')
      )
    )
  );

  menuItems: MenuItem[] = MENU_CONFIG;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    protected themeService: ThemeService
  ) {
    themeService.setTheme();
  }

  switchTheme() {
    if (this.themeService.theme === 'dark') {
      this.themeService.setLightTheme();
    } else {
      this.themeService.setDarkTheme();
    }
  }

  private createBreadcrumbs(
    actualroute: ActivatedRoute,
    root: ActivatedRoute,
    breadcrumbs: MenuItem[] = [],
    url: string = ''
  ): MenuItem[] {
    const children: ActivatedRoute[] = root.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      url += `/${routeURL}`;

      let label = child.snapshot.data['breadcrumb'];

      if (child.snapshot.params['id']) {
        label += ' ' + child.snapshot.params['id'];
      }

      if (!(label === null || label === undefined) && label !== '') {
        if (label !== actualroute.snapshot.data['breadcrumb']) {
          breadcrumbs.push({ label, routerLink: url });
          // console.log(`label: ${label}, routerLink: ${url}`);
        }
      }

      return this.createBreadcrumbs(actualroute, child, breadcrumbs, url);
    }

    return breadcrumbs;
  }

  private getActualActivatedRoute(
    activatedRoute: ActivatedRoute
  ): ActivatedRoute {
    for (const subRoute of activatedRoute.children) {
      return subRoute.children.length > 0
        ? this.getActualActivatedRoute(subRoute)
        : subRoute;
    }

    return activatedRoute;
  }
}
