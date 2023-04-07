import { Identity } from '@shared/decorators/identity.decorator';
import { Label } from '@shared/decorators/label.decorator';
import { Model } from '@shared/decorators/model.decorator';
import { Search } from '@shared/decorators/search.decorator';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { HospitalFloorModel } from './hospital-floor.model';

@Model('Sector', 'Sectores')
export class HospitalSectorModel extends CrudTableModel {
  @Identity() id?: string;
  @Label() @Search() name?: string;
  updated?: string;
  created?: string;
  expand?: { floor?: HospitalFloorModel };
}
