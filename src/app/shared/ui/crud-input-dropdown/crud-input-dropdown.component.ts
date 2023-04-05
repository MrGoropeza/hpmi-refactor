import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CrudErrorMessage,
  CrudErrorMessagePipe,
} from '@shared/pipes/crud-error-message.pipe';
import { DropdownModule } from 'primeng/dropdown';
import {
  CrudInputWrapperComponent,
  CrudInputWrapperTemplateDirective,
} from '../crud-input-wrapper/crud-input-wrapper.component';

@Component({
  selector: 'crud-input-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
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
        <p-dropdown
          styleClass="w-full"
          appendTo="body"
          [id]="name"
          [formControlName]="name"
          [ngClass]="{ 'ng-invalid ng-dirty': isInvalid }"
          [options]="options"
          [optionLabel]="optionLabel"
          [optionValue]="optionValue"
          [autoDisplayFirst]="autoDisplayFirst"
          [filter]="filter"
        ></p-dropdown>
      </ng-template>
    </crud-input-wrapper>
  `,
})
export class CrudInputDropdownComponent {
  @Input() formGroup!: FormGroup;
  @Input() name!: string;
  @Input() customErrors: CrudErrorMessage[] = [];
  @Input() label!: string;
  @Input() leftIcon!: string;
  @Input() rightIcon!: string;

  @Input() options: unknown[] = [];
  @Input() optionLabel!: string;
  @Input() optionValue!: string;
  @Input() autoDisplayFirst = false;
  @Input() filter = true;

  @Input()
  public set disabled(v: boolean) {
    const control = this.formGroup.controls[this.name];
    if (!control) return;
    if (v) control.disable();
    if (!v) control.enable();
  }
}
