import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {
  CrudErrorMessage,
  CrudErrorMessagePipe,
} from '../../pipes/crud-error-message.pipe';
import {
  CrudInputWrapperComponent,
  CrudInputWrapperTemplateDirective,
} from '../crud-input-wrapper/crud-input-wrapper.component';

@Component({
  selector: 'crud-input-text',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CrudErrorMessagePipe,
    CrudInputWrapperComponent,
    CrudInputWrapperTemplateDirective,
  ],
  template: `
    <crud-input-wrapper
      [formGroup]="formGroup"
      [name]="name"
      [customErrors]="customErrors"
      [label]="label"
      [leftIcon]="leftIcon"
      [rightIcon]="rightIcon"
    >
      <ng-template CrudInputWrapperTemplate let-isInvalid>
        <input
          pInputText
          [ngClass]="{ 'ng-invalid ng-dirty': isInvalid }"
          [id]="name"
          [placeholder]="placeholder"
          [formControlName]="name"
        />
      </ng-template>
    </crud-input-wrapper>
  `,
})
export class CrudInputTextComponent {
  @Input() formGroup!: FormGroup;
  @Input() name!: string;
  @Input() customErrors: CrudErrorMessage[] = [];
  @Input() label!: string;
  @Input() leftIcon!: string;
  @Input() rightIcon!: string;

  @Input() placeholder = '';

  @Input()
  public set disabled(v: boolean) {
    const control = this.formGroup.controls[this.name];
    if (!control) return;
    if (v) control.disable({ emitEvent: false });
    if (!v) control.enable({ emitEvent: false });
  }
}
