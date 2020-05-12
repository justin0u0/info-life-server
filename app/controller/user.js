'use strict';

const { Controller } = require('egg');

class UserController extends Controller {
  async addUser() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      username: {
        type: 'string',
        allowEmpty: false,
        min: 6,
      },
      name: {
        type: 'string',
        allowEmpty: false,
      },
      email: {
        type: 'email',
      },
      password: {
        type: 'password',
      },
    };

    try {
      ctx.validate(rule, body);
      const { username, name, email, password } = body;
      const res = await service.user.create({ username, name, email, password });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getUser() {
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
      const res = await service.user.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getUsers() {
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
      const res = await service.user.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyUser() {
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
      const { _id, ...params } = body;
      const res = await service.user.updateOne({ _id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async removeUser() {
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
      const res = await service.user.deleteOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = UserController;
