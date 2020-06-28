'use strict';

const { Controller } = require('egg');

class QuestionController extends Controller {
  async addQuestion() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      tag_id: {
        type: 'object_id',
      },
      title: {
        type: 'string',
        max: 150,
      },
      content: {
        type: 'content_object',
      },
      images: {
        type: 'files',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user_id;
      const res = await service.question.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _addQuestion() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      user_id: {
        type: 'object_id',
      },
      tag_id: {
        type: 'object_id',
      },
      title: {
        type: 'string',
        max: 150,
      },
      content: {
        type: 'content_object',
      },
      images: {
        type: 'files',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const res = await service.question.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getQuestion() {
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
      const res = await service.question.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getQuestions() {
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
      const res = await service.question.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getQuestionsByCurrentUser() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

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
      filter.user_id = user_id;
      const res = await service.question.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyQuestion() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
      tag_id: {
        type: 'object_id',
        required: false,
      },
      title: {
        type: 'string',
        max: 150,
        required: false,
      },
      content: {
        type: 'content_object',
        required: false,
      },
      images: {
        type: 'files',
        required: false,
      },
      is_solved: {
        type: 'boolean',
        required: false,
      },
      best_answer_id: {
        type: 'object_id',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.question.updateOne({ _id, user_id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _modifyQuestion() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
      tag_id: {
        type: 'object_id',
        required: false,
      },
      title: {
        type: 'string',
        max: 150,
        required: false,
      },
      content: {
        type: 'content_object',
        required: false,
      },
      images: {
        type: 'files',
        required: false,
      },
      is_solved: {
        type: 'boolean',
        required: false,
      },
      best_answer_id: {
        type: 'object_id',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.question.updateOne({ _id }, params, true);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async removeQuestion() {
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
      const res = await service.question.deleteOne({ _id, user_id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _removeQuestion() {
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
      const res = await service.question.deleteOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async increaseViewCount() {
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
      const res = await service.question.increaseViewCount({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = QuestionController;
