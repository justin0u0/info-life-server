'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class AnswerService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Answer, User } = model;

    try {
      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Answer,
        include: ['user_id', 'question_id', 'content', 'images'],
      });
      filteredParams.created_at = Date.now();

      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';

      const res = await Answer.create(filteredParams);
      logger.info('Create answer successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create answer to database', error);
    }
  }
}

module.exports = AnswerService;
