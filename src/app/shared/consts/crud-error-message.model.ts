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
