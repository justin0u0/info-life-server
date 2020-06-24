'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class QuestionService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Question, User, Tag } = model;

    try {
      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Question,
        include: ['user_id', 'tag_id', 'title', 'content', 'images'],
      });
      filteredParams.is_solved = false;
      filteredParams.created_at = Date.now();

      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure tag exists
      const tag = await Tag.exists({ _id: params.tag_id, type: 'question' });
      if (!tag) throw 'Failed to find tag in database';

      const res = await Question.create(filteredParams);
      logger.info('Create question successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create question to database', error);
    }
  }
}

module.exports = QuestionService;
