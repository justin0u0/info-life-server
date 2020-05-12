'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class UserService extends Service {
  async create(params) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { User } = model;

    try {
      const res = await User.create(params);
      logger.info('Create user successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to create user to database', error);
    }
  }
}

module.exports = UserService;
