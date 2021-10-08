import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Country, CountryRelations, Owner} from '../models';
import {OwnerRepository} from './owner.repository';

export class CountryRepository extends DefaultCrudRepository<
  Country,
  typeof Country.prototype.countryCode,
  CountryRelations
> {

  public readonly owners: HasManyRepositoryFactory<Owner, typeof Country.prototype.countryCode>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('OwnerRepository') protected ownerRepositoryGetter: Getter<OwnerRepository>,
  ) {
    super(Country, dataSource);
    this.owners = this.createHasManyRepositoryFactoryFor('owners', ownerRepositoryGetter,);
    this.registerInclusionResolver('owners', this.owners.inclusionResolver);


  }
}
