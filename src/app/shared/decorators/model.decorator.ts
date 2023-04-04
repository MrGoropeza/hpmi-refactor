import 'reflect-metadata';

export const modelMetadataKey = Symbol('model');

export const Model = (name: string, pluralName: string) => (target: any) => {
  Reflect.defineMetadata(modelMetadataKey, { name, pluralName }, target);
};
