'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class AnswerService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Answer, User, Question } = model;

    try {
      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure question exists
      const question = await Question.exists({ _id: params.question_id });
      if (!question) throw 'Failed to find question in database';

      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Answer,
        include: ['user_id', 'question_id', 'content', 'images'],
      });
      filteredParams.created_at = Date.now();

      const res = await Answer.create(filteredParams);
      logger.info('Create answer successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create answer to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Answer } = model;

    try {
      const answer = await Answer.findOne(filter).lean();
      if (answer) {
        await service.user.tidyUpUser(answer);
        // TODO: tidy up sub-answer
      }
      logger.info('Find answer successfully');
      return answer;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find answer in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Answer } = model;

    try {
      const total = await Answer.countDocuments(filter).lean();
      const data = await Answer.find(filter, null, { limit, skip, sort }).lean();
      await service.user.tidyUpUsers(data);
      logger.info('Find answers successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find answers in database', error);
    }
  }

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Answer } = model;

    try {
      const filteredParams = service.utils.filterData({
        data: params,
        model: Answer,
        exclude: ['_id', 'user_id', 'question_id', 'created_at', 'updated_at'],
      });
      filteredParams.updated_at = Date.now();

      const res = await Answer.updateOne(filter, filteredParams).lean();
      logger.info('Update answer successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update answer in database', error);
    }
  }
}

module.exports = AnswerService;
