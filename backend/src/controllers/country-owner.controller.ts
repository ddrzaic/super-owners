import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Country,
  Owner
} from '../models';
import {CountryRepository} from '../repositories';

export class CountryOwnerController {
  constructor(
    @repository(CountryRepository) protected countryRepository: CountryRepository,
  ) { }

  @get('/countries/{id}/owners', {
    responses: {
      '200': {
        description: 'Array of Country has many Owner',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Owner)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Owner>,
  ): Promise<Owner[]> {
    return this.countryRepository.owners(id).find(filter);
  }

  @post('/countries/{id}/owners', {
    responses: {
      '200': {
        description: 'Country model instance',
        content: {'application/json': {schema: getModelSchemaRef(Owner)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Country.prototype.countryCode,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {
            title: 'NewOwnerInCountry',
            exclude: ['owner_id'],
            optional: ['country_code']
          }),
        },
      },
    }) owner: Omit<Owner, 'owner_id'>,
  ): Promise<Owner> {
    return this.countryRepository.owners(id).create(owner);
  }

  @patch('/countries/{id}/owners', {
    responses: {
      '200': {
        description: 'Country.Owner PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {partial: true}),
        },
      },
    })
    owner: Partial<Owner>,
    @param.query.object('where', getWhereSchemaFor(Owner)) where?: Where<Owner>,
  ): Promise<Count> {
    return this.countryRepository.owners(id).patch(owner, where);
  }

  @del('/countries/{id}/owners', {
    responses: {
      '200': {
        description: 'Country.Owner DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Owner)) where?: Where<Owner>,
  ): Promise<Count> {
    return this.countryRepository.owners(id).delete(where);
  }
}
