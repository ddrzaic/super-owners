import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, postgresql: {schema: 'public', table: 'ownercar'}}
})
export class Ownercar extends Entity {
  @property({
    type: 'number',
    required: true,
    scale: 0,
    id: 1,
    postgresql: {columnName: 'owner_id', dataType: 'integer', dataLength: null, dataPrecision: null, dataScale: 0, nullable: 'NO'},
  })
  ownerId: number;

  @property({
    type: 'string',
    required: true,
    length: 10,
    id: 2,
    postgresql: {columnName: 'licence_plate', dataType: 'character varying', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'NO'},
  })
  licencePlate: string;

  @property({
    type: 'string',
  })
  licence_plate?: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Ownercar>) {
    super(data);
  }
}

export interface OwnercarRelations {
  // describe navigational properties here
}

export type OwnercarWithRelations = Ownercar & OwnercarRelations;
