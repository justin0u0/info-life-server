'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;

  // `Authentication Middleware` will set `ctx.state.user` to jwt payload,
  // if `strict = true`, must carry jwt,
  // else `strict = false`, can carry jwt
  const authentication = (strict = true) => middleware.authentication(app, strict);
  // `Authorization Middleware`: user role permission
  const authorization = (allowRoles) => middleware.authorization(app, allowRoles);

  // For Testing
  router.get('/', controller.home.index);

  // The following APIs are for normal user
  // Users
  router.post('/user/addUser', controller.user.addUser);
  router.post('/user/getUser', authentication(), authorization(['normal']), controller.user.getUser);
  router.post('/user/modifyUser', authentication(), authorization(['normal']), controller.user.modifyUser);
  router.post('/user/removeUser', authentication(), authorization(['normal']), controller.user.removeUser);

  // Sessions
  router.post('/session/login', controller.session.login);

  // Posts
  router.post('/post/addPost', authentication(), authorization(['normal']), controller.post.addPost);
  router.post('/post/getPost', controller.post.getPost);
  router.post('/post/getPosts', controller.post.getPosts);

  // The following APIs are for admin user
  router.post('/admin/user/addUser', controller.user.addUser);
  router.post('/admin/user/getUser', controller.user._getUser);
  router.post('/admin/user/getUsers', controller.user._getUsers);
  router.post('/admin/user/modifyUser', controller.user._modifyUser);
  router.post('/admin/user/removeUser', controller.user._removeUser);
};
