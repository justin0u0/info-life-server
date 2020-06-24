'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class CommentService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Comment, User, Post } = model;

    try {
      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure parent exists
      if (params.parent_type === 'post') {
        const post = await Post.exists({ _id: params.parent_id });
        if (!post) throw 'Failed to find post in database';
      } else if (params.parent_type === 'comment') {
        const comment = await Comment.findOne({ _id: params.parent_id }, { parent_type: 1 }).lean();
        if (!comment) throw 'Failed to find comment in database';
        if (comment.parent_type === 'comment') throw 'Cannot add a comment under a subcomment';
      }

      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Comment,
        exclude: ['created_at', 'updated_at'],
      });
      filteredParams.created_at = Date.now();

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

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Comment } = model;

    try {
      const filteredParams = service.utils.filterData({
        data: params,
        model: Comment,
        include: ['content', 'images'],
      });
      filteredParams.updated_at = Date.now();

      const res = await Comment.updateOne(filter, filteredParams).lean();
      logger.info('Update comment successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update comment in database', error);
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Comment } = model;

    try {
      const comment = await Comment.findOne(filter, { _id: 1, parent_type: 1 }).lean();
      if (comment) {
        // Delete all subcomment under this comment
        await Comment.deleteMany({ parent_type: 'comment', parent_id: comment._id }).lean();
      }

      const res = await Comment.deleteOne(filter).lean();
      logger.info('Delete comment successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete comment to database');
    }
  }
}

module.exports = CommentService;
