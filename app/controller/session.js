
'use strict';

const { Controller } = require('egg');

class SessionController extends Controller {
  async login() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    const rule = {
      username: {
        type: 'string',
        allowEmpty: false,
        trim: true,
      },
      password: {
        type: 'string',
        allowEmpty: false,
        trim: true,
      },
    };

    try {
      ctx.validate(rule, body);
      const { username, password } = body;
      const res = await service.session.login(username, password);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = SessionController;
