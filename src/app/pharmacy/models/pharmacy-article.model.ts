import { Identity } from '@shared/decorators/identity.decorator';
import { Label } from '@shared/decorators/label.decorator';
import { Model } from '@shared/decorators/model.decorator';
import { Search } from '@shared/decorators/search.decorator';
import { CrudTableModel } from '@shared/models/crud-table.model';
import { PharmacyArticleCategoryModel } from './pharmacy-article-category.model';
import { PharmacyArticleUnitModel } from './pharmacy-article-unit.model';

@Model('Artículo', 'Artículos')
export class PharmacyArticleModel extends CrudTableModel {
  @Identity() id?: string;
  @Search() @Label() name?: string;
  description?: string;
  dueDate?: Date;
  created?: Date;
  updated?: Date;
  expand?: {
    category?: PharmacyArticleCategoryModel;
    unit?: PharmacyArticleUnitModel;
  };
}
