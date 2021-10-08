import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Car, Country, Owner, Ownercar, OwnerRelations, Usercomment} from '../models';
import {CarRepository} from './car.repository';
import {CommentRepository} from './comment.repository';
import {CountryRepository} from './country.repository';
import {OwnercarRepository} from './ownercar.repository';

export class OwnerRepository extends DefaultCrudRepository<
  Owner,
  typeof Owner.prototype.owner_id,
  OwnerRelations
> {

  public readonly country: BelongsToAccessor<Country, typeof Owner.prototype.owner_id>;

  public readonly cars: HasManyThroughRepositoryFactory<Car, typeof Car.prototype.licencePlate,
    Ownercar,
    typeof Owner.prototype.owner_id
  >;

  public readonly comments: HasManyRepositoryFactory<Usercomment, typeof Owner.prototype.owner_id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CountryRepository') protected countryRepositoryGetter: Getter<CountryRepository>, @repository.getter('OwnercarRepository') protected ownercarRepositoryGetter: Getter<OwnercarRepository>, @repository.getter('CarRepository') protected carRepositoryGetter: Getter<CarRepository>, @repository.getter('CommentRepository') protected commentRepositoryGetter: Getter<CommentRepository>,
  ) {
    super(Owner, dataSource);
    this.comments = this.createHasManyRepositoryFactoryFor('comments', commentRepositoryGetter,);
    this.registerInclusionResolver('comments', this.comments.inclusionResolver);
    this.cars = this.createHasManyThroughRepositoryFactoryFor('cars', carRepositoryGetter, ownercarRepositoryGetter,);
    this.registerInclusionResolver('cars', this.cars.inclusionResolver);
    this.country = this.createBelongsToAccessorFor('country', countryRepositoryGetter,);
    this.registerInclusionResolver('country', this.country.inclusionResolver);
  }
}
