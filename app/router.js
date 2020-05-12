'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, jwt } = app;
  router.get('/', controller.home.index);

  // The following APIs are for normal user
  // Users
  router.post('/user/addUser', controller.user.addUser);
  router.post('/user/getUser', jwt, controller.user.getUser);
  router.post('/user/modifyUser', jwt, controller.user.modifyUser);

  // Sessions
  router.post('/session/login', controller.session.login);

  // The following APIs are for admin user
  router.post('/admin/user/getUser', controller.user._getUser);
  router.post('/admin/user/getUsers', controller.user._getUsers);
  router.post('/admin/user/modifyUser', controller.user._modifyUser);
  router.post('/admin/user/removeUser', controller.user._removeUser);
};
