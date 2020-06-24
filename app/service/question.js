'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class QuestionService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Question, User, Tag } = model;

    try {
      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure tag exists
      const tag = await Tag.exists({ _id: params.tag_id, type: 'question' });
      if (!tag) throw 'Failed to find tag in database';

      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Question,
        include: ['user_id', 'tag_id', 'title', 'content', 'images'],
      });
      filteredParams.is_solved = false;
      filteredParams.created_at = Date.now();

      const res = await Question.create(filteredParams);
      logger.info('Create question successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create question to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Question } = model;

    try {
      const question = await Question.findOne(filter).lean();
      if (question) {
        await service.user.tidyUpUser(question);
        await service.tag.tidyUpTag(question);
      }
      logger.info('Find question successfully');
      return question;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find question in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Question } = model;

    try {
      const total = await Question.countDocuments(filter).lean();
      const data = await Question.find(filter, null, { limit, skip, sort }).lean();
      await service.user.tidyUpUsers(data);
      await service.tag.tidyUpTags(data);
      logger.info('Find questions successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find questions in database', error);
    }
  }

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Question, Tag, Answer } = model;

    try {
      // Ensure tag exists
      if (params.tag_id) {
        const tag = await Tag.exists({ _id: params.tag_id, type: 'question' });
        if (!tag) throw 'Failed to find tag in database';
      }
      // Ensure `is_solved = true` and should carry `best_answer_id`
      if (params.is_solved === true) {
        if (!params.best_answer_id) throw 'Setting \'is_solved = true\' should carry \'best_answer_id\'';
        // Ensure answer exists
        const answer = await Answer.exists({ _id: params.best_answer_id });
        if (!answer) throw 'Failed to find answer in database';
      }

      const filteredParams = service.utils.filterData({
        data: params,
        model: Question,
        exclude: ['_id', 'user_id', 'created_at', 'updated_at'],
      });
      filteredParams.updated_at = Date.now();

      const res = await Question.updateOne(filter, filteredParams).lean();
      logger.info('Update question successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update question in database', error);
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Question } = model;

    try {
      const res = await Question.deleteOne(filter).lean();
      // TODO: Delete all answers
      logger.info('Delete question successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete question to database');
    }
  }
}

module.exports = QuestionService;
