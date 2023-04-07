import { Identity } from '@shared/decorators/identity.decorator';
import { Label } from '@shared/decorators/label.decorator';
import { Model } from '@shared/decorators/model.decorator';
import { Search } from '@shared/decorators/search.decorator';
import { CrudTableModel } from '@shared/models/crud-table.model';

@Model('Planta', 'Plantas')
export class HospitalFloorModel extends CrudTableModel {
  @Identity() id?: string;
  @Label() @Search() name?: string;
  updated?: string;
  created?: string;
}
