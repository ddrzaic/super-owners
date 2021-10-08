import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, postgresql: {schema: 'public', table: 'car'}}})
export class Car extends Entity {
  @property({
    type: 'string',
    required: true,
    length: 10,
    id: true,
    postgresql: {columnName: 'licence_plate', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  licencePlate: string;

  @property({
    type: 'string',
    length: 15,
    postgresql: {columnName: 'color', dataType: 'character varying', dataLength: 15, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  color?: string;

  @property({
    type: 'string',
    length: 20,
    postgresql: {columnName: 'make', dataType: 'character varying', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  make?: string;

  @property({
    type: 'string',
    length: 30,
    postgresql: {columnName: 'model', dataType: 'character varying', dataLength: 30, dataPrecision: null, dataScale: null, nullable: 'YES'},
  })
  model?: string;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'model_year', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  modelYear?: number;

  @property({
    type: 'number',
    scale: 0,
    postgresql: {columnName: 'price', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'YES'},
  })
  price?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Car>) {
    super(data);
  }
}

export interface CarRelations {
  // describe navigational properties here
}

export type CarWithRelations = Car & CarRelations;
