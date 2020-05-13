'use strict';

const { Controller } = require('egg');

class TagController extends Controller {
  async addTag() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      name: {
        type: 'string',
        allowEmpty: false,
      },
      color: {
        type: 'integer',
        min: 0,
        max: (256 ** 3) - 1,
      },
    };

    try {
      ctx.validate(rule, body);
      const { name, color } = body;
      const res = await service.tag.create({ name, color });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getTag() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    const rule = {
      _id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = body;
      const res = await service.tag.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getTags() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    const rule = {
      filter: {
        type: 'object',
        required: false,
      },
      limit: {
        type: 'interger',
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
      // Tag limit default to no limit
      const { filter = {}, limit = 0, skip = 0, sort = {} } = body;
      const res = await service.tag.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyTag() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    const rule = {
      _id: {
        type: 'object_id',
      },
      color: {
        type: 'integer',
        min: 0,
        max: (256 ** 3) - 1,
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.tag.updateOne({ _id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async removeTag() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    const rule = {
      _id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = body;
      const res = await service.tag.deleteOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = TagController;
