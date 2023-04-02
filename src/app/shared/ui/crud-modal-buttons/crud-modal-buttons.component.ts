import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'crud-modal-buttons',
  standalone: true,
  imports: [CommonModule, ButtonModule, ConfirmDialogModule],
  template: `
    <div class="mt-6 flex justify-end gap-2">
      <button
        pButton
        icon="pi pi-times"
        label="Cancelar"
        [loading]="loading"
        (click)="onCancel()"
      ></button>
      <button
        pButton
        type="submit"
        icon="pi pi-save"
        label="Guardar"
        [loading]="loading"
        (click)="save.emit()"
      ></button>
    </div>
  `,
})
export class CrudModalButtonsComponent {
  @Input() loading = false;
  @Output() cancel = new EventEmitter();
  @Output() save = new EventEmitter();

  constructor(private confirmationService: ConfirmationService) {}

  onCancel() {
    this.confirmationService.confirm({
      header: '¿Seguro que querés salir?',
      message: 'Se perderán todos los cambios.',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.cancel.emit(),
    });
  }
}
