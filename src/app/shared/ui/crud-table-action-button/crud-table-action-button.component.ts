import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'crud-table-action-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule],
  template: `
    <button
      pButton
      type="button"
      class="p-button-rounded p-button-raised {{ severityClass }}"
      [pTooltip]="tooltip"
      [tooltipPosition]="tooltipPosition"
      [icon]="icon"
      (click)="buttonClick.emit()"
    ></button>
  `,
})
export class CrudTableActionButtonComponent {
  @Input() tooltip!: string;
  @Input() tooltipPosition = 'top';
  @Input() severity:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'info'
    | 'warning'
    | 'help'
    | 'danger' = 'primary';
  @Input() icon = 'pi pi-play';
  @Output() buttonClick = new EventEmitter();

  get severityClass(): string {
    return this.severity !== 'primary' ? `p-button-${this.severity}` : '';
  }
}
