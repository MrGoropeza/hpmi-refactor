import { Identity } from '@shared/decorators/identity.decorator';
import { Label } from '@shared/decorators/label.decorator';
import { Model } from '@shared/decorators/model.decorator';
import { Search } from '@shared/decorators/search.decorator';
import { CrudTableModel } from '@shared/models/crud-table.model';

@Model('Unidad', 'Unidades')
export class PharmacyArticleUnitModel extends CrudTableModel {
  @Identity() id?: string;
  @Search() @Label() abreviation?: string;
  name?: string;
  created?: Date;
  updated?: Date;
}
