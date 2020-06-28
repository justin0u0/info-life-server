'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class FeedbackService extends Service {
  async create(params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Feedback } = model;

    try {
      // Filter parameters
      const filteredParams = service.utils.filterData({
        data: params,
        model: Feedback,
        exclude: ['_id'],
      });

      const res = await Feedback.create(filteredParams);
      logger.info('Create feedback successfully');
      return res;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1000, 'Failed to create feedback to database', error);
    }
  }

  async findOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Feedback } = model;

    try {
      const feedback = await Feedback.findOne(filter).lean();
      logger.info('Find feedback successfully');
      return feedback;
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find feedback in database', error);
    }
  }

  async findAll({ filter, limit, skip, sort }) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Feedback } = model;

    try {
      const total = await Feedback.countDocuments(filter).lean();
      const data = await Feedback.find(filter, null, { limit, skip, sort }).lean();
      logger.info('Find feedbacks successfully');
      return { total, data };
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1001, 'Failed to find feedbacks in database', error);
    }
  }

  async updateOne(filter, params) {
    const { ctx, service, logger } = this;
    const { model } = ctx;
    const { Feedback } = model;

    try {
      const filteredParams = service.utils.filterData({
        data: params,
        model: Feedback,
        exclude: ['_id'],
      });

      const res = await Feedback.updateOne(filter, filteredParams).lean();
      logger.info('Update feedback successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1002, 'Failed to update feedback in database', error);
    }
  }

  async deleteOne(filter) {
    const { ctx, logger } = this;
    const { model } = ctx;
    const { Feedback } = model;

    try {
      const res = await Feedback.deleteOne(filter).lean();
      logger.info('Delete feedback successfully');
      return res.n > 0 ? { success: true } : {};
    } catch (error) {
      logger.error(error);
      throw new ErrorRes(1003, 'Failed to delete feedback to database');
    }
  }
}

module.exports = FeedbackService;
