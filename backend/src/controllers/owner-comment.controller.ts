import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
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
  HttpErrors,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Owner, Usercomment} from '../models';
import {CommentRepository, NewUserRequestRepository, OwnerRepository} from '../repositories';

@authenticate('jwt')
export class OwnerCommentController {
  constructor(
    @repository(OwnerRepository) protected ownerRepository: OwnerRepository,
    @repository(CommentRepository) protected commentRepository: CommentRepository,
    @repository(NewUserRequestRepository) protected userRepository: NewUserRequestRepository,
  ) { }

  @get('/owners/{id}/comments', {
    responses: {
      '200': {
        description: 'Array of Owner has many Comment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Usercomment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Usercomment>,
  ): Promise<Usercomment[]> {
    return this.ownerRepository.comments(id).find(filter);
  }

  @get('/owners/{id}/comments/count', {
    responses: {
      '200': {
        description: 'Number of comments',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Usercomment>,
  ): Promise<Number> {
    return (await this.ownerRepository.comments(id).find(filter)).length;
  }

  @post('/owners/{id}/comments', {
    responses: {
      '200': {
        description: 'Owner model instance',
        content: {'application/json': {schema: getModelSchemaRef(Usercomment)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Owner.prototype.owner_id,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usercomment, {
            title: 'NewCommentInOwner',
            exclude: ['id', 'userId', 'email', 'datetime', 'owner_id']

          }),
        },
      },
    }) comment: Omit<Usercomment, 'id'>,
  ): Promise<Usercomment> {
    comment.owner_id = id;
    comment.email = (await this.userRepository.findById(currentUserProfile[securityId])).email;
    comment.userId = currentUserProfile[securityId];
    return this.ownerRepository.comments(id).create(comment);
  }

  @patch('/comments/{id}', {
    responses: {
      '200': {
        description: 'Owner.Comment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usercomment, {partial: true, exclude: ['userId', 'email', 'owner_id', 'datetime', 'id']}),
        },
      },
    })
    comment: Partial<Usercomment>,
    @param.query.object('where', getWhereSchemaFor(Usercomment)) where?: Where<Usercomment>,
  ): Promise<void> {
    const prevComment = await this.commentRepository.findById(id);
    if (prevComment.userId != currentUserProfile[securityId]) {
      throw new HttpErrors[403];
    }
    return this.commentRepository.updateById(id, comment);
  }

  @del('/comments/{id}', {
    responses: {
      '200': {
        description: 'Owner.Comment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<void> {
    const comment = await this.commentRepository.findById(id);
    if (comment.userId != currentUserProfile[securityId])
      throw new HttpErrors[403];
    await this.commentRepository.deleteById(id);
  }
}
