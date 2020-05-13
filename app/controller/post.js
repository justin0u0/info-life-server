'use strict';

const { Controller } = require('egg');

class PostController extends Controller {
  async addPost() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { user } = ctx.state;
    const { body } = request;

    // Validate Parameters
    const rule = {
      tag_id: {
        type: 'object_id',
      },
      title: {
        type: 'string',
      },
      subtitle: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      cover: {
        type: 'file',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      body.user_id = user._id;
      const res = await service.post.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _addPost() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate Parameters
    const rule = {
      user_id: {
        type: 'object_id',
      },
      tag_id: {
        type: 'object_id',
      },
      title: {
        type: 'string',
      },
      subtitle: {
        type: 'string',
      },
      content: {
        type: 'string',
      },
      cover: {
        type: 'file',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const res = await service.post.create(body);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getPost() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id = null } = ctx.state.user;

    // Validate Parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = body;
      // Normal user should get published post, but author can get not published post
      const res = await service.post.findOne({ _id, $or: [{ is_published: true }, { is_published: false, user_id }] });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _getPost() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate Parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id } = body;
      const res = await service.post.findOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getPosts() {
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
      // Should only get published posts
      filter.is_published = true;
      const res = await service.post.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _getPosts() {
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
      const res = await service.post.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyPost() {
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
        required: false,
      },
      subtitle: {
        type: 'string',
        required: false,
      },
      content: {
        type: 'string',
        required: false,
      },
      cover: {
        type: 'file',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.post.updateOne({ _id, user_id }, params);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _modifyPost() {
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
        required: false,
      },
      subtitle: {
        type: 'string',
        required: false,
      },
      content: {
        type: 'string',
        required: false,
      },
      cover: {
        type: 'file',
        required: false,
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, ...params } = body;
      const res = await service.post.updateOne({ _id }, params, true);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async removePost() {
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
      const res = await service.post.deleteOne({ _id, user_id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _removePost() {
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
      const res = await service.post.deleteOne({ _id });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async getPostsByCurrentUser() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

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
      const res = await service.post.findAll({ filter, limit, skip, sort });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async modifyIsPublished() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;
    const { _id: user_id } = ctx.state.user;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
      is_published: {
        type: 'boolean',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, is_published } = body;
      const res = await service.post.updateIsPublished({ _id, user_id }, is_published);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async _modifyIsPublished() {
    const { ctx, service } = this;
    const { request, response } = ctx;
    const { body } = request;

    // Validate parameters
    const rule = {
      _id: {
        type: 'object_id',
      },
      is_published: {
        type: 'boolean',
      },
    };

    try {
      ctx.validate(rule, body);
      const { _id, is_published } = body;
      const res = await service.post.updateIsPublished({ _id }, is_published);
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }

  async increaseShareCount() {
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
      const res = await service.post.increaseValue({ _id }, { field: 'share_count', value: 1 });
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
      const res = await service.post.increaseValue({ _id }, { field: 'view_count', value: 1 });
      response.body = res;
    } catch (error) {
      response.status = error.status;
      response.body = { code: error.code, error: error.message, data: error.errors };
    }
  }
}

module.exports = PostController;
