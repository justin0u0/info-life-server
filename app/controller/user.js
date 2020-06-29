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
    const { response } = ctx;
    const { user } = ctx.state;

    try {
      const { _id } = user;
      const res = await service.user.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getUserProfile() {
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
      const res = await service.user.getPublicProfile({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _getUser() {
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

  async _getUsers() {
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
    const { user } = ctx.state;

    const rule = {
      name: {
        type: 'string',
        required: false,
      },
      email: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'file',
        required: false,
      },
      profiles: {
        type: 'object',
        required: false,
      },
      description: {
        type: 'string',
        max: '500',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = user;
      const res = await service.user.updateOne({ _id }, body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _modifyUser() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    const rule = {
      _id: {
        type: 'object_id',
      },
      name: {
        type: 'string',
        required: false,
      },
      email: {
        type: 'string',
        required: false,
      },
      avatar: {
        type: 'file',
        required: false,
      },
      profiles: {
        type: 'object',
        required: false,
      },
      description: {
        type: 'string',
        max: '500',
        required: false,
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
    const { response } = ctx;
    const { user } = ctx.state;

    try {
      const { _id } = user;
      const res = await service.user.deleteOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _removeUser() {
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
