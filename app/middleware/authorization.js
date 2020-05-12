
'use strict';

module.exports = (app, allowRoles) => {
  return async function authorizationMiddleware(ctx, next) {
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
        const { role } = verifyResult;
        if (!allowRoles.includes(role)) throw 'User role is not allow';
        await next();
      } catch (error) {
        response.status = 401;
        response.body = { code: 2002, error: 'Authorization failed', data: error };
      }
    } else {
      response.status = 401;
      response.body = { code: 2002, error: 'Authorization failed' };
    }
  };
};
