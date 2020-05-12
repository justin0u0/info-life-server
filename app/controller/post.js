'use strict';

const { Controller } = require('egg');

class PostController extends Controller {
  async addPost() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { user } = ctx.state;
    const { body } = request;

    // Validate Parameters
    const rule = {
      tag_id: {
        type: 'object_id',
      },
      title: {
        type: 'string',
      },
      subtitle: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      cover: {
        type: 'file',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user._id;
      const res = await service.post.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = PostController;
