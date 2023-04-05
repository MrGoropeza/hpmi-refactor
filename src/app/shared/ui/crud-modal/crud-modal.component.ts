import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LetModule } from '@ngrx/component';
import { CrudModalButtonsComponent } from '../crud-modal-buttons/crud-modal-buttons.component';

interface CrudModalContext {
  $implicit: boolean;
}

@Directive({ selector: 'ng-template[CrudModal]', standalone: true })
export class CrudModalDirective {
  static ngTemplateContextGuard(
    dir: CrudModalDirective,
    ctx: unknown
  ): ctx is CrudModalContext {
    return true;
  }
}

@Component({
  selector: 'crud-modal',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    ReactiveFormsModule,
    CrudModalButtonsComponent,
  ],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="save.emit()">
      <ng-container
        [ngTemplateOutlet]="formRef"
        [ngTemplateOutletContext]="{ $implicit: loading }"
      ></ng-container>

      <crud-modal-buttons
        [loading]="loading"
        (cancel)="cancel.emit()"
      ></crud-modal-buttons>
    </form>
  `,
})
export class CrudModalComponent {
  @ContentChild(CrudModalDirective, { read: TemplateRef })
  formRef!: TemplateRef<any>;

  @Input() loading = false;
  @Input() formGroup!: FormGroup;
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
}
