'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;
  const authentication = middleware.authentication({}, app);

  // For Testing
  router.get('/', controller.home.index);

  // The following APIs are for normal user
  // Users
  router.post('/user/addUser', controller.user.addUser);
  router.post('/user/getUser', authentication, controller.user.getUser);
  router.post('/user/modifyUser', authentication, controller.user.modifyUser);
  router.post('/user/removeUser', authentication, controller.user.removeUser);

  // Sessions
  router.post('/session/login', controller.session.login);

  // The following APIs are for admin user
  router.post('/admin/user/addUser', controller.user.addUser);
  router.post('/admin/user/getUser', controller.user._getUser);
  router.post('/admin/user/getUsers', controller.user._getUsers);
  router.post('/admin/user/modifyUser', controller.user._modifyUser);
  router.post('/admin/user/removeUser', controller.user._removeUser);
};
