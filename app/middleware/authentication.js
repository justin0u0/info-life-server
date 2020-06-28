'use strict';

module.exports = (app, strict) => {
  return async function authenticationMiddleware(ctx, next) {
    const { jwt } = app;
    const { request, response } = ctx;
    const auth = request.headers.authorization;

    if (auth && auth.startsWith('Bearer ')) {
      try {
        const token = auth.slice(7);
        const verifyResult = await new Promise((resolve, reject) => {
          jwt.verify(token, app.config.jwt.secret, (error, decoded) => {
            if (error) reject(error);
            resolve(decoded);
          });
        });
        ctx.state.user = { ...verifyResult };
        await next();
      } catch (error) {
        response.status = 401;
        response.body = { code: 2001, error: 'Authentication failed', data: error };
      }
    } else {
      if (strict) {
        response.status = 401;
        response.body = { code: 2001, error: 'Authentication failed' };
      } else {
        // Set default empty object
        ctx.state.user = {};
        await next();
      }
    }
  };
};
