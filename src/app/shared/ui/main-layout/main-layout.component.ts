import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MegaMenuModule } from 'primeng/megamenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { filter } from 'rxjs';
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
export class MainLayoutComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];
  menuItems: MenuItem[] = MENU_CONFIG;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const items: MenuItem[] = [{ icon: 'pi pi-home', routerLink: '/' }];
        this.breadcrumbItems = this.createBreadcrumbs(
          this.activatedRoute,
          this.activatedRoute.root,
          items
        );
      });
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
}
