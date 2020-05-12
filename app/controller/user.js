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
        required: true,
      },
      name: {
        type: 'string',
        allowEmpty: false,
        required: true,
      },
      email: {
        type: 'string',
        allowEmpty: false,
        required: true,
      },
      password: {
        type: 'password',
        required: true,
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
}

module.exports = UserController;
