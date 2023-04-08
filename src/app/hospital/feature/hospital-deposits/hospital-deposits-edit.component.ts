import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudInputDropdownComponent } from '@shared/ui/crud-input-dropdown/crud-input-dropdown.component';
import { CrudInputTextComponent } from '@shared/ui/crud-input-text/crud-input-text.component';
import {
  CrudModalComponent,
  CrudModalDirective,
} from '@shared/ui/crud-modal/crud-modal.component';
import { MessageService, SelectItem } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Subject, map, take } from 'rxjs';
import { HospitalDepositTypesService } from '../../data-access/hospital-deposit-types.service';
import { HospitalDepositsService } from '../../data-access/hospital-deposits.service';
import { HospitalSectorsService } from '../../data-access/hospital-sectors.service';
import { HospitalDepositModel } from '../../models/hospital-deposit.model';

@Component({
  selector: 'app-hospital-deposits-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrudModalComponent,
    CrudModalDirective,
    CrudInputTextComponent,
    CrudInputDropdownComponent,
  ],
  templateUrl: './hospital-deposits-edit.component.html',
})
export class HospitalDepositsEditComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  sectors$ = this.sectorsService.listAll({ expand: 'floor' }).pipe(
    map((values) =>
      values.map(
        (value) =>
          ({
            value: value.Identity,
            label: `${value.Label} - ${value.expand?.floor?.name}`,
          } as SelectItem)
      )
    )
  );
  types$ = this.typesService.listAll({ filter: "name != 'Farmacia'" });

  loading = false;
  formGroup = this.fb.group({
    id: this.fb.control<string | null>(null),
    sector: this.fb.control<string | null>(null, Validators.required),
    type: this.fb.control<string | null>(null, Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig<{ id: string }>,
    private messageService: MessageService,
    private service: HospitalDepositsService,
    private sectorsService: HospitalSectorsService,
    private typesService: HospitalDepositTypesService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

    let operation: Observable<HospitalDepositModel>;

    if (this.formGroup.getRawValue().id) {
      operation = this.service.update(
        Object.assign(new HospitalDepositModel(), this.formGroup.getRawValue())
      );
    } else {
      operation = this.service.create(
        Object.assign(new HospitalDepositModel(), this.formGroup.getRawValue())
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
