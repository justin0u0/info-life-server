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
        type: 'number',
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
}

module.exports = TagController;
