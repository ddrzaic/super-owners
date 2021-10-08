import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  AnyObject,
  Count,
  CountSchema,
  DataObject, FilterExcludingWhere,
  Model,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get, getModelSchemaRef, param, patch, post, put, requestBody, RequestContext, response
} from '@loopback/rest';
import {Owner} from '../models';
import {OwnerRepository} from '../repositories';

@authenticate('jwt')
export class OwnerController {
  constructor(
    @inject.context()
    public context: RequestContext,
    @repository(OwnerRepository)
    public ownerRepository: OwnerRepository,
  ) { }

  @post('/owners')
  @response(200, {
    description: 'Owner model instance',
    content: {'application/json': {schema: getModelSchemaRef(Owner)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {
            title: 'NewOwner',

          }),
        },
      },
    })
    owner: Owner,
  ): Promise<Owner> {
    return this.ownerRepository.create(owner);
  }

  @get('/owners/count')
  @response(200, {
    description: 'Owner model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.query.string("name") full_name: string,
    @param.query.string("limit") limit: string,
    @param.query.string("offset") offset: string,
    @param.query.string("continent") continent: string,
    @param.query.string("younger_than") younger_than: string,
    @param.query.string("older_than") older_than: string,

  ): Promise<AnyObject> {
    let sql_query = `SELECT COUNT (owner.*) FROM owner LEFT JOIN country on owner.country_code = country.country_code`;
    let query_has_where_statement = false;
    if (typeof full_name !== 'undefined') {
      sql_query += ` WHERE (first_name || ' ' || last_name)
       ILIKE '%${full_name}%' `;
      query_has_where_statement = true;
    }
    if (typeof continent !== 'undefined') {
      if (query_has_where_statement) {
        sql_query += ` AND country.continent ILIKE '%${continent}%'`;
      }
      else {
        sql_query += ` WHERE country.continent ILIKE '%${continent}%'`;
        query_has_where_statement = true;
      }
    }
    if (typeof older_than !== 'undefined') {
      if (query_has_where_statement) {
        sql_query += ` AND owner.age > ${older_than}`;
      }
      else {
        sql_query += ` AND owner.age > ${older_than}`;
        query_has_where_statement = true;
      }
    }
    if (typeof younger_than !== 'undefined') {
      if (query_has_where_statement) {
        sql_query += ` AND owner.age < ${younger_than}`;
      }
      else {
        sql_query += ` AND owner.age < ${younger_than}`;
        query_has_where_statement = true;
      }
    }

    if (typeof limit !== 'undefined') {
      sql_query += ` LIMIT ${limit}`;
    }

    if (typeof offset !== 'undefined') {
      sql_query += ` OFFSET ${offset}`;
    }

    const count = await this.ownerRepository.execute(sql_query);
    return count;
  }

  @get('/owners')
  @response(200, {
    description: 'Array of Owner model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Owner, {includeRelations: true}),
        },
      },
    },
  })

  async find(
    @param.query.string("name") full_name: string,
    @param.query.string("limit") limit: string,
    @param.query.string("offset") offset: string,
    @param.query.string("continent") continent: string,
    @param.query.string("younger_than") younger_than: string,
    @param.query.string("older_than") older_than: string,

  ): Promise<AnyObject[]> {
    let sql_query = `SELECT owner.* FROM owner LEFT JOIN country on owner.country_code = country.country_code`;
    let query_has_where_statement = false;
    if (typeof full_name !== 'undefined') {
      sql_query += ` WHERE (first_name || ' ' || last_name)
       ILIKE '%${full_name}%' `;
      query_has_where_statement = true;
    }
    if (typeof continent !== 'undefined') {
      if (query_has_where_statement) {
        sql_query += ` AND country.continent ILIKE '%${continent}%'`;
      }
      else {
        sql_query += ` WHERE country.continent ILIKE '%${continent}%'`;
        query_has_where_statement = true;
      }
    }
    if (typeof older_than !== 'undefined') {
      if (query_has_where_statement) {
        sql_query += ` AND owner.age > ${older_than}`;
      }
      else {
        sql_query += ` AND owner.age > ${older_than}`;
        query_has_where_statement = true;
      }
    }
    if (typeof younger_than !== 'undefined') {
      if (query_has_where_statement) {
        sql_query += ` AND owner.age < ${younger_than}`;
      }
      else {
        sql_query += ` AND owner.age < ${younger_than}`;
        query_has_where_statement = true;
      }
    }

    if (typeof limit !== 'undefined') {
      sql_query += ` LIMIT ${limit}`;
    }

    if (typeof offset !== 'undefined') {
      sql_query += ` OFFSET ${offset}`;
    }

    const rawItems = await this.ownerRepository.execute(sql_query);

    return rawItems.map((i: DataObject<Model> | undefined) => new Owner(i));
  }



  @patch('/owners')
  @response(200, {
    description: 'Owner PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {partial: true}),
        },
      },
    })
    owner: Owner,
    @param.where(Owner) where?: Where<Owner>,
  ): Promise<Count> {
    return this.ownerRepository.updateAll(owner, where);
  }

  @get('/owners/{id}')
  @response(200, {
    description: 'Owner model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Owner, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Owner, {exclude: 'where'}) filter?: FilterExcludingWhere<Owner>
  ): Promise<Owner> {
    return this.ownerRepository.findById(id, filter);
  }

  @patch('/owners/{id}')
  @response(204, {
    description: 'Owner PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Owner, {partial: true}),
        },
      },
    })
    owner: Owner,
  ): Promise<void> {
    await this.ownerRepository.updateById(id, owner);
  }

  @put('/owners/{id}')
  @response(204, {
    description: 'Owner PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() owner: Owner,
  ): Promise<void> {
    await this.ownerRepository.replaceById(id, owner);
  }

  @del('/owners/{id}')
  @response(204, {
    description: 'Owner DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.ownerRepository.deleteById(id);
  }




}
