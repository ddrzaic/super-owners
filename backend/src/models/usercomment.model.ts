import {User} from '@loopback/authentication-jwt';
import {belongsTo, Entity, model, property} from '@loopback/repository';

@model()
export class Usercomment extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  comment_content: string;

  @property({
    type: 'number',
    required: true,
  })
  owner_id: number;

  @belongsTo(() => User)
  userId: string;

  @property({
    type: "date",
    dataType: "timestamp",
    generated: true
  })
  datetime: Date;





  constructor(data?: Partial<Usercomment>) {
    super(data);
  }
}

export interface CommentRelations {
  // describe navigational properties here
}

export type CommentWithRelations = Comment & CommentRelations;
