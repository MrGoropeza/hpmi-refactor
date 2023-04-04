import { CrudTableModel } from '@shared/models/crud-table.model';
import 'reflect-metadata';

export const modelSearchMetadataKey = Symbol('search');

export const Search = () => (target: CrudTableModel, key: string) => {
  Reflect.defineMetadata(
    modelSearchMetadataKey,
    key,
    target.constructor,
    modelSearchMetadataKey
  );
};
