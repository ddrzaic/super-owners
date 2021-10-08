import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Owner,
  Country,
} from '../models';
import {OwnerRepository} from '../repositories';

export class OwnerCountryController {
  constructor(
    @repository(OwnerRepository)
    public ownerRepository: OwnerRepository,
  ) { }

  @get('/owners/{id}/country', {
    responses: {
      '200': {
        description: 'Country belonging to Owner',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Country)},
          },
        },
      },
    },
  })
  async getCountry(
    @param.path.number('id') id: typeof Owner.prototype.owner_id,
  ): Promise<Country> {
    return this.ownerRepository.country(id);
  }
}
