import { CrudTableModel } from '@shared/models/crud-table.model';
import 'reflect-metadata';

export const modelIdentityMetadataKey = Symbol('identity');

export const Identity = () => (target: CrudTableModel, key: string) => {
  Reflect.defineMetadata(
    modelIdentityMetadataKey,
    key,
    target.constructor,
    modelIdentityMetadataKey
  );
};
