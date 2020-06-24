'use strict';

const { Controller } = require('egg');

class QuestionController extends Controller {
  async addQuestion() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      tag_id: {
        type: 'object_id',
      },
      title: {
        type: 'string',
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
      const res = await service.question.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = QuestionController;
