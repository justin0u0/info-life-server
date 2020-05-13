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

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Tag } = model;

    try {
      const filteredParams = service.utils.filterData({ data: params, model: Tag, exclude: ['_id'] });

      const res = await Tag.updateOne(filter, filteredParams).lean();
      logger.info('Update tag successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update tag to database');
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Post, Tag } = model;

    try {
      const tag = await Tag.findOne(filter, { _id: 1 }).lean();
      await Post.updateMany({ tag_id: tag._id }, { tag_id: null }).lean();
      const res = await Tag.deleteOne(filter).lean();
      logger.info('Delete tag successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete tag to database');
    }
  }
}

module.exports = TagService;
