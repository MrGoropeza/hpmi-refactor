import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudInputDropdownComponent } from '@shared/ui/crud-input-dropdown/crud-input-dropdown.component';
import { CrudInputTextComponent } from '@shared/ui/crud-input-text/crud-input-text.component';
import {
  CrudModalComponent,
  CrudModalDirective,
} from '@shared/ui/crud-modal/crud-modal.component';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, take } from 'rxjs';
import { HospitalFloorsService } from '../../data-access/hospital-floors.service';
import { HospitalSectorsService } from '../../data-access/hospital-sectors.service';
import { HospitalSectorModel } from '../models/hospital-sector.model';

@Component({
  selector: 'app-hospital-sectors-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrudModalComponent,
    CrudModalDirective,
    CrudInputTextComponent,
    CrudInputDropdownComponent,
  ],
  templateUrl: './hospital-sectors-edit.component.html',
})
export class HospitalSectorsEditComponent {
  floors$ = this.floorsService.listAll();

  loading = false;

  formGroup = this.fb.group({
    id: this.fb.control<string | null>(null),
    name: this.fb.control<string | null>(null, [
      Validators.required,
      Validators.maxLength(200),
    ]),
    floor: this.fb.control<string | null>(null, Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig<{ id: string }>,
    private service: HospitalSectorsService,
    private messageService: MessageService,
    private floorsService: HospitalFloorsService
  ) {}

  ngOnInit(): void {
    if (this.config.data) {
      this.loading = true;
      this.service
        .get(this.config.data.id)
        .pipe(take(1))
        .subscribe({
          complete: () => (this.loading = false),
          next: (value) => this.formGroup.patchValue(value),
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al recuperar el registro, intentá de nuevo.',
            });
            this.cancel();
          },
        });
    }
  }

  cancel() {
    this.ref.close(false);
  }

  save() {
    this.loading = true;
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No completaste todos los campos.',
      });
      return;
    }

    let operation: Observable<HospitalSectorModel>;

    if (this.formGroup.getRawValue().id) {
      operation = this.service.update(
        Object.assign(new HospitalSectorModel(), this.formGroup.getRawValue())
      );
    } else {
      operation = this.service.create(
        Object.assign(new HospitalSectorModel(), this.formGroup.getRawValue())
      );
    }

    operation.subscribe({
      complete: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Registro ${
            this.formGroup.getRawValue().id ? 'actualizado' : 'creado'
          } correctamente.`,
        });
        this.ref.close(true);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Error al ${
            this.formGroup.getRawValue().id ? 'actualizar' : 'crear'
          } el registro. Intentá de nuevo.`,
        });
      },
    });
  }
}
