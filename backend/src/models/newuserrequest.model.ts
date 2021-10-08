import {User} from '@loopback/authentication-jwt';
import {property} from '@loopback/repository';

export class NewUserRequest extends User {

  @property({
    id: true,
    type: 'string',
    required: true,
  })
  id: string;
  @property({
    type: 'string',
    required: true,
  })
  password: string;

}

export interface NewUserRequestRelations {
  // describe navigational properties here
}

export type NewUserRequestWithRelations = NewUserRequest & NewUserRequestRelations;
