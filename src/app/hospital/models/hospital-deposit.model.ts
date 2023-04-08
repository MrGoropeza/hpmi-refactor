import { Identity } from '@shared/decorators/identity.decorator';
import { Label } from '@shared/decorators/label.decorator';
import { Model } from '@shared/decorators/model.decorator';
import { Search } from '@shared/decorators/search.decorator';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { HospitalDepositTypeModel } from './hospital-deposit-type.model';
import { HospitalSectorModel } from './hospital-sector.model';

@Model('Depósito', 'Depósitos')
export class HospitalDepositModel extends CrudTableModel {
  @Identity() @Label() @Search() id?: string;
  updated?: string;
  created?: string;
  expand?: { sector?: HospitalSectorModel; type?: HospitalDepositTypeModel };
}
