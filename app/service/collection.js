'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class CollectionService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Collection, User, Post } = model;

    try {
      // Ensure user exists
      const user = await User.exists({ _id: params.user_id });
      if (!user) throw 'Failed to find user in database';
      // Ensure post exists
      const post = await Post.exists({ _id: params.post_id });
      if (!post) throw 'Failed to find post in database';

      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Collection,
        include: ['user_id', 'post_id'],
      });

      const res = await Collection.create(filteredParams);
      logger.info('Create collection successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create collection to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Collection } = model;

    try {
      const collection = await Collection.findOne(filter).lean();
      if (collection) {
        await Promise.all([
          service.user.tidyUpUser(collection),
          service.post.tidyUpPost(collection),
        ]);
      }
      logger.info('Find collection successfully');
      return collection;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find collection in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Collection } = model;

    try {
      const total = await Collection.countDocuments(filter).lean();
      const data = await Collection.find(filter, null, { limit, skip, sort }).lean();
      await Promise.all([
        service.user.tidyUpUsers(data),
        service.post.tidyUpPosts(data),
      ]);
      logger.info('Find collecitons successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find collections in database', error);
    }
  }

  async count(filter, currentUserId = null) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Collection } = model;

    try {
      const total = await Collection.countDocuments(filter).lean();
      const data = { total, current_user_is_collected: null };
      if (currentUserId !== null) {
        const collection = await Collection.findOne({ ...filter, user_id: currentUserId });
        data.current_user_is_collected = !!collection;
      }
      logger.info('Count collections successfully');
      return data;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1004, 'Failed to count collections in database', error);
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Collection } = model;

    try {
      const res = await Collection.deleteOne(filter).lean();
      logger.info('Delete collection successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete collection to database');
    }
  }
}

module.exports = CollectionService;
