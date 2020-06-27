'use strict';

const { Controller } = require('egg');

class CollectionController extends Controller {
  async addCollection() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      post_id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user_id;
      const res = await service.collection.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _addCollection() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      user_id: {
        type: 'object_id',
      },
      post_id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const res = await service.collection.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = CollectionController;
