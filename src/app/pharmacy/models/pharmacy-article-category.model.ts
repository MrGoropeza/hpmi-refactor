import { Identity } from '@shared/decorators/identity.decorator';
import { Label } from '@shared/decorators/label.decorator';
import { Model } from '@shared/decorators/model.decorator';
import { Search } from '@shared/decorators/search.decorator';
import { CrudTableModel } from '@shared/models/crud-table.model';

@Model('Categoría', 'Categorías')
export class PharmacyArticleCategoryModel extends CrudTableModel {
  @Identity() id?: string;
  @Search() @Label() name?: string;
  created?: Date;
  updated?: Date;
}
