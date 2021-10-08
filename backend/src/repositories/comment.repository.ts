import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CommentRelations, Usercomment} from '../models';

export class CommentRepository extends DefaultCrudRepository<
  Usercomment,
  typeof Usercomment.prototype.id,
  CommentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Usercomment, dataSource);
  }
}
