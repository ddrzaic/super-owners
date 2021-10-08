import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {NewUserRequest, NewUserRequestRelations} from '../models';


export class NewUserRequestRepository extends DefaultCrudRepository<
  NewUserRequest,
  typeof NewUserRequest.prototype.id,
  NewUserRequestRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(NewUserRequest, dataSource);
  }
}
