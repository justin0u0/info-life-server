'use strict';

const { Controller } = require('egg');

class ReactionController extends Controller {
  async addReaction() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      type: {
        type: 'enum',
        values: ['like', 'dislike'],
      },
      source_type: {
        type: 'enum',
        values: ['post', 'question', 'answer'],
      },
      source_id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user_id;
      const res = await service.reaction.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _addReaction() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      user_id: {
        type: 'object_id',
      },
      type: {
        type: 'enum',
        values: ['like', 'dislike'],
      },
      source_type: {
        type: 'enum',
        values: ['post', 'question', 'answer'],
      },
      source_id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const res = await service.reaction.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = ReactionController;
