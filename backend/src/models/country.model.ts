import {Entity, hasMany, model, property} from '@loopback/repository';
import {Owner} from './owner.model';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'country'}}
})
export class Country extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    id: 1,
    postgresql: {columnName: 'country_code', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  countryCode: number;

  @property({
    type: 'string',
    required: true,
    length: 50,
    postgresql: {columnName: 'country_name', dataType: 'character varying', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  countryName: string;

  @property({
    type: 'string',
    required: true,
    length: 20,
    postgresql: {columnName: 'continent', dataType: 'character varying', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  continent: string;

  @hasMany(() => Owner, {keyTo: 'country_code'})
  owners: Owner[];

  constructor(data?: Partial<Country>) {
    super(data);
  }
}

export interface CountryRelations {
  // describe navigational properties here
}

export type CountryWithRelations = Country & CountryRelations;
