'use strict';

const { Controller } = require('egg');

class AnswerController extends Controller {
  async addAnswer() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      question_id: {
        type: 'object_id',
      },
      content: {
        type: 'content_object',
      },
      images: {
        type: 'files',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user_id;
      const res = await service.answer.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _addAnswer() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      user_id: {
        type: 'object_id',
      },
      question_id: {
        type: 'object_id',
      },
      content: {
        type: 'content_object',
      },
      images: {
        type: 'files',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const res = await service.answer.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = AnswerController;
