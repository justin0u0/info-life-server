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

  async findOne(filter) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Reaction } = model;

    try {
      const reaction = await Reaction.findOne(filter).lean();
      if (reaction) {
        await service.user.tidyUpUser(reaction);
      }
      logger.info('Find reaction successfully');
      return reaction;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find reaction in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Reaction } = model;

    try {
      const total = await Reaction.countDocuments(filter).lean();
      const data = await Reaction.find(filter, null, { limit, skip, sort }).lean();
      await service.user.tidyUpUsers(data);
      logger.info('Find reactions successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find reactions in database', error);
    }
  }

  async count(filter, currentUserId = null) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Reaction } = model;

    try {
      const like = await Reaction.countDocuments({ ...filter, type: 'like' }).lean();
      const dislike = await Reaction.countDocuments({ ...filter, type: 'dislike' }).lean();
      const data = { like, dislike, current_user_reaction: null };
      if (currentUserId !== null) {
        const reaction = await Reaction.findOne({ ...filter, user_id: currentUserId }).lean();
        if (reaction) {
          data.current_user_reaction = reaction.type;
        }
      }
      logger.info('Count reactions successfully');
      return data;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1004, 'Failed to count reactions in database', error);
    }
  }

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Reaction } = model;

    try {
      const filteredParams = service.utils.filterData({
        data: params,
        model: Reaction,
        include: ['type'],
      });

      const res = await Reaction.updateOne(filter, filteredParams).lean();
      logger.info('Update reaction successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update reaction in database', error);
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Reaction } = model;

    try {
      const res = await Reaction.deleteOne(filter).lean();
      logger.info('Delete reaction successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete reaction to database');
    }
  }
}

module.exports = ReactionService;
