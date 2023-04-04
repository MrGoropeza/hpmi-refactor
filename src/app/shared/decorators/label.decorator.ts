import { CrudTableModel } from '@shared/models/crud-table.model';
import 'reflect-metadata';

export const modelLabelMetadataKey = Symbol('label');

export const Label = () => (target: CrudTableModel, key: string) => {
  Reflect.defineMetadata(
    modelLabelMetadataKey,
    key,
    target.constructor,
    modelLabelMetadataKey
  );
};
