import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ownercar, OwnercarRelations} from '../models';

export class OwnercarRepository extends DefaultCrudRepository<
  Ownercar,
  typeof Ownercar.prototype.ownerId,
  OwnercarRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Ownercar, dataSource);
  }
}
