'use strict';

const { Controller } = require('egg');

class CommentController extends Controller {
  async addComment() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      parent_type: {
        type: 'enum',
        values: ['post', 'comment'],
      },
      parent_id: {
        type: 'object_id',
      },
      content: {
        type: 'string',
      },
      images: {
        type: 'files',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user_id;
      const res = await service.comment.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = CommentController;
