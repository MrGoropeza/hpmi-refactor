import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {
  CrudErrorMessage,
  CrudErrorMessagePipe,
} from '../../pipes/crud-error-message.pipe';

@Component({
  selector: 'crud-input-text',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CrudErrorMessagePipe,
  ],
  template: `
    <span
      [ngClass]="{
        'flex flex-col': true,
        'p-float-label mt-6': !!label,
        'p-input-icon-left': !!leftIcon,
        'p-input-icon-right': !!rightIcon
      }"
      [formGroup]="formGroup"
    >
      <i *ngIf="leftIcon" [ngClass]="leftIcon"></i>
      <i *ngIf="rightIcon" [ngClass]="rightIcon"></i>
      <input
        pInputText
        [ngClass]="{ 'ng-invalid ng-dirty': isInvalid }"
        [id]="name"
        [placeholder]="placeholder"
        [formControlName]="name"
      />
      <label [htmlFor]="name">{{ label }}</label>
    </span>
    <small *ngIf="isInvalid" class="text-red-700" [id]="name + '-help'">
      {{ formGroup.controls[name].errors | crudErrorMessage : customErrors }}
    </small>
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
    if (v) control.disable();
    if (!v) control.enable();
  }

  public get isInvalid(): boolean {
    const control = this.formGroup.controls[this.name];
    if (!control) return false;
    return (
      this.formGroup.controls[this.name].invalid &&
      this.formGroup.controls[this.name].touched
    );
  }
}
