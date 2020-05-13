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
      const filteredParams = service.utils.filterData({ data: params, model: User, exclude: ['username', 'password', 'role'] });

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
      // TODO: Delete related model too
      logger.info('Delete user successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete user in database');
    }
  }

  // Utilities

  /**
   * Assign user to datum by `datum.user_id`
   * @param {Object} datum datum to format
   * @param {Object} datum.user_id user._id
   */
  async tidyUpUser(datum) {
    const { ctx } = this;
    const { model } = ctx;
    const { User } = model;

    const { user_id = null } = datum;
    if (!user_id) throw 'Failed to tidy up user, invalid parameter';
    const { avatar = null, ...user } = await User.findOne({ _id: user_id }, { username: 1, name: 1, avatar: 1 }).lean();
    datum.user = { ...user, avatar };
    return datum;
  }

  /**
   * Assign user to each datum in data by `datum.user_id`
   * @param {Object[]} data data to format
   * @param {Object} data[].user_id user._id
   */
  async tidyUpUsers(data) {
    const { ctx } = this;
    const { model } = ctx;
    const { User } = model;

    const userArr = [];
    for (const datum of data) {
      if (!datum.user_id) throw 'Failed to tidy up users, invalid parameter';
      userArr.push(datum.user_id);
    }

    const users = await User.find({ _id: userArr }, { username: 1, name: 1, avatar: 1 }).lean();
    const userObj = {};
    for (const user of users) {
      const { _id, username, name, avatar = null } = user;
      userObj[_id] = { _id, username, name, avatar };
    }
    for (const datum of data) datum.user = userObj[datum.user_id];
    return data;
  }
}

module.exports = UserService;
