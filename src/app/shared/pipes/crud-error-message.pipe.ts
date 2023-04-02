import { Pipe, PipeTransform } from '@angular/core';
import {
  CrudErrorMessage,
  defaultErrorMessages,
} from '../consts/crud-error-message.model';

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
