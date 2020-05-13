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

  async findOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Tag } = model;

    try {
      const res = await Tag.findOne(filter).lean();
      logger.info('Find tag successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find tag in database');
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Tag } = model;

    try {
      const total = await Tag.countDocuments(filter).lean();
      const data = await Tag.find(filter, null, { limit, skip, sort }).lean();
      logger.info('Find tags successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find tags in database');
    }
  }
}

module.exports = TagService;
