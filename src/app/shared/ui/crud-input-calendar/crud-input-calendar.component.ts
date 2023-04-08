import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CrudErrorMessage } from '@shared/pipes/crud-error-message.pipe';
import { CalendarModule } from 'primeng/calendar';
import {
  CrudInputWrapperComponent,
  CrudInputWrapperTemplateDirective,
} from '../crud-input-wrapper/crud-input-wrapper.component';

@Component({
  selector: 'crud-input-calendar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrudInputWrapperComponent,
    CrudInputWrapperTemplateDirective,
    CalendarModule,
  ],
  template: `
    <crud-input-wrapper
      [formGroup]="formGroup"
      [name]="name"
      [customErrors]="customErrors"
      [label]="label"
      [leftIcon]="leftIcon"
    >
      <ng-template CrudInputWrapperTemplate let-isInvalid>
        <p-calendar
          appendTo="body"
          styleClass="w-full"
          [ngClass]="{ 'ng-invalid ng-dirty': isInvalid }"
          [formControlName]="name"
          [readonlyInput]="true"
          dateFormat="dd/mm/yy"
        ></p-calendar>
      </ng-template>
    </crud-input-wrapper>
  `,
})
export class CrudInputCalendarComponent {
  @Input() formGroup!: FormGroup;
  @Input() name!: string;
  @Input() customErrors: CrudErrorMessage[] = [];
  @Input() label!: string;
  @Input() leftIcon!: string;
  @Input()
  public set disabled(v: boolean) {
    const control = this.formGroup.controls[this.name];
    if (!control) return;
    if (v) control.disable({ emitEvent: false });
    if (!v) control.enable({ emitEvent: false });
  }
}
