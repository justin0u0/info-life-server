'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  // Users
  router.post('/user/addUser', controller.user.addUser);
  router.post('/user/getUser', controller.user.getUser);
  router.post('/user/getUsers', controller.user.getUsers);
  router.post('/user/modifyUser', controller.user.modifyUser);
  router.post('/user/removeUser', controller.user.removeUser);
};
