'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class PostService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { User, Post } = model;

    try {
      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Post,
        exclude: ['created_at', 'updated_at', 'published_at', 'share_count', 'view_count'],
      });
      filteredParams.created_at = Date.now();
      filteredParams.share_count = 0;
      filteredParams.view_count = 0;

      // Insure user exist
      const user = await User.findOne({ _id: params.user_id }).lean();
      if (!user) throw 'Failed to find user in database';
      // TODO: Insure tag exist

      const res = await Post.create(filteredParams);
      logger.info('Create post successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create post to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Post } = model;

    try {
      const post = await Post.findOne(filter).lean();
      await service.user.tidyUpUser(post);
      // TODO: tody up tag
      logger.info('Find post successfully');
      return post;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find post in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Post } = model;

    try {
      const total = await Post.countDocuments(filter).lean();
      const data = await Post.find(filter, null, { limit, skip, sort }).lean();
      await service.user.tidyUpUsers(data);
      logger.info('Find posts successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find posts in database', error);
    }
  }

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Post } = model;

    try {
      const filteredParams = service.utils.filterData({
        data: params,
        model: Post,
        include: ['tag_id', 'title', 'subtitle', 'content', 'images', 'cover'],
      });
      filteredParams.updated_at = Date.now();

      const res = await Post.updateOne(filter, filteredParams).lean();
      logger.info('Update post successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update post to database', error);
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Post } = model;

    try {
      const res = await Post.deleteOne(filter).lean();
      logger.info('Delete post successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete post to database', error);
    }
  }
}

module.exports = PostService;
