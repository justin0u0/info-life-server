'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class ReactionService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Reaction, User, Post, Question, Answer } = model;

    try {
      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure post exists if given
      if (params.source_type === 'post') {
        const post = await Post.exists({ _id: params.source_id });
        if (!post) throw 'Failed to find post in database';
        // Ensure post reaction type should no be 'dislike'
        if (params.type === 'dislike') throw 'Post reaction should not be dislike';
      }
      // Ensure question exists if given
      if (params.source_type === 'question') {
        const question = await Question.exists({ _id: params.source_id });
        if (!question) throw 'Failed to find question in database';
      }
      // Ensure answer exists if given
      if (params.source_type === 'answer') {
        const answer = await Answer.exists({ _id: params.source_id });
        if (!answer) throw 'Failed to find answer in database';
      }

      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Reaction,
        include: ['user_id', 'source_type', 'source_id', 'type'],
      });

      const res = await Reaction.create(filteredParams);
      logger.info('Create reaction successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create reaction to database', error);
    }
  }
}

module.exports = ReactionService;
