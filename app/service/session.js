'use strict';

const { Service } = require('egg');
const ErrorRes = require('../lib/errorRes');

class SessionService extends Service {
  async login(username, password) {
    const { ctx, app, logger } = this;
    const { model } = ctx;
    const { User } = model;
    const { jwt } = app;

    const user = await User.findOne({ username }).lean();
    if (!user) throw new ErrorRes(2000, 'Failed to login, wrong username or password');
    const validPassword = await ctx.compare(password, user.password);
    if (!validPassword) throw new ErrorRes(2000, 'Failed to login, wrong username or password');

    const payload = {
      _id: user._id,
      username,
      role: user.role,
    };
    const token = jwt.sign(payload, app.config.jwt.secret);
    logger.info('User login successfully');
    return { token };
  }
}

module.exports = SessionService;
