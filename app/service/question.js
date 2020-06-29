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
      filteredParams.view_count = 0;

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

  async updateOne(filter, params, isAdmin = false) {
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

      const exclude = ['_id', 'user_id', 'created_at', 'updated_at'];
      if (!isAdmin) exclude.push('view_count');
      const filteredParams = service.utils.filterData({
        data: params,
        model: Question,
        exclude,
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

  async increaseViewCount(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Question } = model;

    try {
      const res = await Question.updateOne(filter, { $inc: { view_count: 1 } }).lean();
      logger.info('Update question view_count successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update question view_count to database', error);
    }
  }

  // Utilities

  /**
   * Assign question to datum by `datum.question_id`
   * @param {Object} datum datum to format
   * @param {Object} datum.question_id question._id
   */
  async tidyUpQuestion(datum) {
    const { ctx, service } = this;
    const { model } = ctx;
    const { Question } = model;

    const { question_id = null } = datum;
    if (!question_id) throw 'FAiled to tidy up question, invalid parameter';
    const question = await Question.findOne({ _id: question_id }, {
      user_id: 1,
      tag_id: 1,
      title: 1,
      created_at: 1,
    }).lean();

    await Promise.all([
      // Tidy up user
      service.user.tidyUpUser(question),
      // Tidy up tag
      service.tag.tidyUpTag(question),
    ]);
    datum.question = question;
    return datum;
  }

  /**
   * Assign question to each datum in data by `datum.question_id`
   * @param {Object[]} data data to format
   * @param {Object} data[].question_id question._id
   */
  async tidyUpQuestions(data) {
    const { ctx, service } = this;
    const { model } = ctx;
    const { Question } = model;

    const questionArr = [];
    for (const datum of data) {
      if (!datum.question_id) throw 'Failed to tidy up questions, invalid parameters';
      questionArr.push(datum.question_id);
    }

    const questions = await Question.find({ _id: questionArr }, {
      user_id: 1,
      tag_id: 1,
      title: 1,
      created_at: 1,
    }).lean();

    await Promise.all([
      // Tidy up users
      service.user.tidyUpUsers(questions),
      // Tidy up tags
      service.tag.tidyUpTags(questions),
    ]);

    const questionObj = {};
    for (const question of questions) {
      const { _id } = question;
      questionObj[_id] = question;
    }
    for (const datum of data) datum.question = questionObj[datum.question_id];
    return data;
  }
}

module.exports = QuestionService;
