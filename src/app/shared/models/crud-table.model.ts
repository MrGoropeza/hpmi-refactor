import { modelMetadataKey } from '@shared/decorators/model.decorator';
import 'reflect-metadata';
import { modelIdentityMetadataKey } from '../decorators/identity.decorator';
import { modelLabelMetadataKey } from '../decorators/label.decorator';
import { modelSearchMetadataKey } from '../decorators/search.decorator';

export class CrudTableModel {
  get Identity(): string {
    const key = Reflect.getMetadata(
      modelIdentityMetadataKey,
      this.constructor,
      modelIdentityMetadataKey
    );
    console.log(key);

    return key ? (this as any)[key] : '';
  }

  get Label(): string {
    const key = Reflect.getMetadata(
      modelLabelMetadataKey,
      this.constructor,
      modelLabelMetadataKey
    );
    return key ? (this as any)[key] : '';
  }

  get SearchProperty(): string {
    const key = Reflect.getMetadata(
      modelSearchMetadataKey,
      this.constructor,
      modelSearchMetadataKey
    );
    return key ? (this as any)[key] : '';
  }

  get modelName(): string {
    return Reflect.getMetadata(modelMetadataKey, this.constructor).name;
  }

  get pluralName(): string {
    return Reflect.getMetadata(modelMetadataKey, this.constructor).pluralName;
  }
}
