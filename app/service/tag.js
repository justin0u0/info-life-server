'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class TagService extends Service {
  async create(params) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Tag } = model;

    try {
      const res = await Tag.create(params);
      logger.info('Create tag successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create tag to database');
    }
  }
}

module.exports = TagService;
