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

  async _addComment() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      user_id: {
        type: 'object_id',
      },
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
      const res = await service.comment.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getComment() {
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
      const res = await service.comment.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getComments() {
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
      const res = await service.comment.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyComment() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
      content: {
        type: 'string',
        required: false,
      },
      images: {
        type: 'files',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.comment.updateOne({ _id, user_id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _modifyComment() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      _id: {
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
      const { _id, ...params } = body;
      const res = await service.comment.updateOne({ _id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async removeComment() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = body;
      const res = await service.comment.deleteOne({ _id, user_id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _removeComment() {
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
      const res = await service.comment.deleteOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = CommentController;
