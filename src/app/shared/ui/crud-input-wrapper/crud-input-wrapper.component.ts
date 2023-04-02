import { CommonModule, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  Input,
  TemplateRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  CrudErrorMessage,
  CrudErrorMessagePipe,
} from '@shared/pipes/crud-error-message.pipe';

interface CrudInputWrapperContext {
  $implicit: boolean;
}

@Directive({
  selector: 'ng-template[CrudInputWrapperTemplate]',
  standalone: true,
})
export class CrudInputWrapperTemplateDirective {
  static ngTemplateContextGuard(
    dir: CrudInputWrapperTemplateDirective,
    ctx: unknown
  ): ctx is CrudInputWrapperContext {
    return true;
  }
}

@Component({
  selector: 'crud-input-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CrudErrorMessagePipe,
    NgTemplateOutlet,
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

      <ng-container
        *ngTemplateOutlet="templateRef; context: { $implicit: isInvalid }"
      ></ng-container>

      <label [htmlFor]="name">{{ label }}</label>
    </span>
    <small *ngIf="isInvalid" class="text-red-700" [id]="name + '-help'">
      {{ formGroup.controls[name].errors | crudErrorMessage : customErrors }}
    </small>
  `,
})
export class CrudInputWrapperComponent {
  @ContentChild(CrudInputWrapperTemplateDirective, { read: TemplateRef })
  templateRef!: TemplateRef<any>;

  @Input() formGroup!: FormGroup;
  @Input() name!: string;
  @Input() customErrors: CrudErrorMessage[] = [];
  @Input() label!: string;
  @Input() leftIcon!: string;
  @Input() rightIcon!: string;

  public get isInvalid(): boolean {
    const control = this.formGroup.controls[this.name];
    if (!control) return false;

    return (
      this.formGroup.controls[this.name].invalid &&
      this.formGroup.controls[this.name].touched
    );
  }
}
