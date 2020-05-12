'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class UserService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { User } = model;

    try {
      const filteredParams = service.utils.filterData({ data: params, model: User });
      filteredParams.password = await ctx.genHash(params.password);
      filteredParams.role = 'normal';

      const res = await User.create(filteredParams);
      logger.info('Create user successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create user to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { User } = model;

    try {
      const res = await User.findOne(filter).lean();
      logger.info('Find user successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find user in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { User } = model;

    try {
      const total = await User.countDocuments(filter).lean();
      const data = await User.find(filter, null, { limit, skip, sort }).lean();
      logger.info('Find users successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find users in database', error);
    }
  }

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { User } = model;

    try {
      const filteredParams = service.utils.filterData({ data: params, model: User, exclude: ['password', 'role'] });

      const res = await User.updateOne(filter, filteredParams).lean();
      logger.info('Update user successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update user in database');
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { User } = model;

    try {
      const res = await User.deleteOne(filter).lean();
      logger.info('Delete user successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete user in database');
    }
  }
}

module.exports = UserService;
