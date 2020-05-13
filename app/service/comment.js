'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class CommentService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Comment, User, Post } = model;

    try {
      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Comment,
        exclude: ['created_at', 'updated_at'],
      });
      filteredParams.created_at = Date.now();

      // Insure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Insure parent exists
      if (params.parent_type === 'post') {
        const post = await Post.exists({ _id: params.parent_id });
        if (!post) throw 'Failed to find post in database';
      } else if (params.parent_type === 'comment') {
        const comment = await Comment.findOne({ _id: params.parent_id }, { parent_type: 1 }).lean();
        if (!comment) throw 'Failed to find comment in database';
        if (comment.parent_type === 'comment') throw 'Cannot add a comment under a subcomment';
      }

      const res = await Comment.create(filteredParams);
      logger.info('Create comment successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create comment to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Comment } = model;

    try {
      const comment = await Comment.findOne(filter).lean();
      if (comment) {
        await service.user.tidyUpUser(comment);
      }

      logger.info('Find comment successfully');
      return comment;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find comment in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Comment } = model;

    try {
      const total = await Comment.countDocuments(filter).lean();
      const data = await Comment.find(filter, null, { limit, skip, sort }).lean();
      await service.user.tidyUpUsers(data);
      logger.info('Find comments successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find comments in database', error);
    }
  }
}

module.exports = CommentService;
