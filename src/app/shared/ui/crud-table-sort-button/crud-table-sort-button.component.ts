import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Table } from 'primeng/table';

@Component({
  selector: 'crud-table-sort-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <button
      pButton
      class="p-button-text p-button-rounded p-button-secondary p-button-sm p-button-raised"
      [icon]="icon"
      (click)="table.sort({ field })"
    ></button>
  `,
})
export class CrudTableSortButtonComponent {
  @Input() table!: Table;
  @Input() field!: string;

  public get icon(): string {
    if (this.table.sortField === this.field) {
      return this.table.sortOrder === 1 ? 'pi pi-sort-up' : 'pi pi-sort-down';
    } else {
      return 'pi pi-sort';
    }
  }
}
