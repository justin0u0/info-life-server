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

  async getReaction() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = body;
      const res = await service.reaction.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getReactions() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      filter: {
        type: 'object',
        required: false,
      },
      limit: {
        type: 'integer',
        required: false,
      },
      skip: {
        type: 'integer',
        required: false,
      },
      sort: {
        type: 'object',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { filter = {}, limit = 10, skip = 0, sort = {} } = body;
      const res = await service.reaction.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async countReactions() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id = null } = ctx.state.user;

    // Validate parameters
    const rule = {
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
      const { source_type, source_id } = body;
      const res = await service.reaction.count({ source_type, source_id }, user_id);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyReaction() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
      type: {
        type: 'enum',
        values: ['like', 'dislike'],
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.reaction.updateOne({ _id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = ReactionController;
