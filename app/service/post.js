'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class PostService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { User, Post, Tag } = model;

    try {
      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure tag exists
      const tag = await Tag.exists({ _id: params.tag_id, type: 'post' });
      if (!tag) throw 'Failed to find tag in database';

      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Post,
        exclude: ['is_published', 'created_at', 'updated_at', 'published_at', 'share_count', 'view_count'],
      });
      filteredParams.created_at = Date.now();
      filteredParams.share_count = 0;
      filteredParams.view_count = 0;
      filteredParams.is_published = false;

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
      if (post) {
        await Promise.all([
          service.user.tidyUpUser(post),
          service.tag.tidyUpTag(post),
        ]);
      }
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
      if (data.length > 0) {
        await Promise.all([
          service.user.tidyUpUsers(data),
          service.tag.tidyUpTags(data),
        ]);
      }
      logger.info('Find posts successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find posts in database', error);
    }
  }

  async updateOne(filter, params, isAdmin = false) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Post, Tag } = model;

    try {
      // Ensure tag exists
      if (params.tag_id) {
        const tag = await Tag.exists({ _id: params.tag_id, type: 'post' });
        if (!tag) throw 'Failed to find tag in database';
      }

      const include = ['tag_id', 'title', 'subtitle', 'content', 'images', 'cover'];
      if (isAdmin) include.push(...['share_count', 'view_count']);
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
      // TODO: Delete all comments
      logger.info('Delete post successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete post to database', error);
    }
  }

  async updateIsPublished(filter, is_published) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Post } = model;

    try {
      const params = { is_published };
      if (is_published) params.published_at = Date.now();

      const res = await Post.updateOne(filter, params).lean();
      logger.info('Update post is_published successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update post is_published to database', error);
    }
  }

  async increaseValue(filter, { field, value }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Post } = model;

    try {
      const res = await Post.updateOne(filter, { $inc: { [field]: value } }).lean();
      logger.info(`Update post ${field} successfully`);
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, `Failed to update post ${field} to database`, error);
    }
  }

  // Utilities

  /**
   * Assign post to datum by `datum.post_id`
   * @param {Object} datum datum to format
   * @param {Object} datum.post user._id
   */
  async tidyUpPost(datum) {
    const { ctx, service } = this;
    const { model } = ctx;
    const { Post } = model;

    const { post_id = null } = datum;
    if (!post_id) throw 'Failed to tidy up post, invalid parameter';
    const post = await Post.findOne({ _id: post_id }, {
      user_id: 1,
      title: 1,
      subtitle: 1,
      created_at: 1,
      view_count: 1,
      cover: 1,
    }).lean();
    // Tidy up user
    await service.user.tidyUpUser(post);
    datum.post = post;
    return datum;
  }

  /**
   * Assign post to each datum in data by `datum.post_id`
   * @param {Object[]} data data to format
   * @param {Object} data[].post_id post._id
   */
  async tidyUpPosts(data) {
    const { ctx, service } = this;
    const { model } = ctx;
    const { Post } = model;

    const postArr = [];
    for (const datum of data) {
      if (!datum.post_id) throw 'Failed to tidy up posts, invalid parameter';
      postArr.push(datum.post_id);
    }

    const posts = await Post.find({ _id: postArr }, {
      user_id: 1,
      title: 1,
      subtitle: 1,
      created_at: 1,
      view_count: 1,
      cover: 1,
    }).lean();
    await service.user.tidyUpUsers(posts);
    const postObj = {};
    for (const post of posts) {
      const { _id } = post;
      postObj[_id] = post;
    }
    for (const datum of data) datum.post = postObj[datum.post_id];
    return data;
  }
}

module.exports = PostService;
