import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'crudErrorMessage',
  standalone: true,
})
export class CrudErrorMessagePipe implements PipeTransform {
  transform(errors: any, errorMessages?: CrudErrorMessage[]): string {
    let errorString = '';

    const messages = defaultErrorMessages.concat(
      errorMessages ? errorMessages : []
    );

    Object.keys(errors).forEach((errorKey) => {
      const search = messages.find((message) => message.errorKey === errorKey);
      errorString += search ? `${search.errorMessage} ` : '';
    });
    return errorString;
  }
}

export interface CrudErrorMessage {
  errorKey: string;
  errorMessage: string;
  errorValue?: string;
}

//TODO add mensajes de error para todos los validators del ReactiveFormsModule
export const defaultErrorMessages: CrudErrorMessage[] = [
  {
    errorKey: 'required',
    errorMessage: 'Campo requerido.',
  },
];
