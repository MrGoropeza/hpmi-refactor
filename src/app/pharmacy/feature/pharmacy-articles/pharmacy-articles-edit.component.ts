import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudInputCalendarComponent } from '@shared/ui/crud-input-calendar/crud-input-calendar.component';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { CrudInputTextComponent } from 'src/app/shared/ui/crud-input-text/crud-input-text.component';
import { CrudModalButtonsComponent } from 'src/app/shared/ui/crud-modal-buttons/crud-modal-buttons.component';
import { PharmacyArticlesService } from '../../data-access/pharmacy-articles.service';
import { PharmacyArticleModel } from '../../models/pharmacy-article.model';

@Component({
  selector: 'app-pharmacy-articles-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrudModalButtonsComponent,
    CrudInputTextComponent,
    CrudInputCalendarComponent,
  ],
  templateUrl: './pharmacy-articles-edit.component.html',
})
export class PharmacyArticlesEditComponent implements OnInit {
  loading$ = new BehaviorSubject<boolean>(false);

  formGroup = this.fb.group({
    id: this.fb.control<string>(''),
    name: this.fb.control<string>('', Validators.required),
    description: this.fb.control<string>('', Validators.required),
    category: this.fb.control<number>(0, Validators.required),
    dueDate: this.fb.control<Date | null>(null, Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig<{ id: string }>,
    private service: PharmacyArticlesService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.config.data) {
      this.loading$.next(true);
      this.service
        .get(this.config.data.id)
        .pipe(take(1))
        .subscribe({
          complete: () => this.loading$.next(false),
          next: (value) => {
            if (value.dueDate) value.dueDate = new Date(value.dueDate as any);

            this.formGroup.patchValue(value);
          },
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
    this.loading$.next(true);
    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      this.loading$.next(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No completaste todos los campos.',
      });
      return;
    }

    let operation: Observable<PharmacyArticleModel>;

    if (this.formGroup.getRawValue().id) {
      operation = this.service.update(
        Object.assign(new PharmacyArticleModel(), this.formGroup.getRawValue())
      );
    } else {
      operation = this.service.create(
        Object.assign(new PharmacyArticleModel(), this.formGroup.getRawValue())
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
        this.loading$.next(false);
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
