import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Car} from './car.model';
import {Country} from './country.model';
import {Ownercar} from './ownercar.model';
import {Usercomment} from './usercomment.model';

@model()
export class Owner extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
    required: true,
  })
  owner_id: number;

  @property({
    type: 'string',
  })
  first_name?: string;

  @property({
    type: 'string',
  })
  last_name?: string;

  @property({
    type: 'number',
  })
  age?: number;



  @belongsTo(() => Country, {name: 'country'})
  country_code: number;

  @hasMany(() => Car, {through: {model: () => Ownercar, keyTo: 'licence_plate'}})
  cars: Car[];

  @hasMany(() => Usercomment, {keyTo: "owner_id"})
  comments: Usercomment[];
}

export interface OwnerRelations {
  // describe navigational properties here
}

export type OwnerWithRelations = Owner & OwnerRelations;
