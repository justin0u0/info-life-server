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
}

module.exports = CollectionService;
