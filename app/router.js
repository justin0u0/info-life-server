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
  router.post('/user/getUserProfile', controller.user.getUserProfile);

  // Sessions
  router.post('/session/login', controller.session.login);

  // Posts
  router.post('/post/addPost', authentication(), authorization(['normal']), controller.post.addPost);
  router.post('/post/getPost', authentication(false), controller.post.getPost);
  router.post('/post/getPosts', controller.post.getPosts);
  router.post('/post/modifyPost', authentication(), authorization(['normal']), controller.post.modifyPost);
  router.post('/post/removePost', authentication(), authorization(['normal']), controller.post.removePost);
  router.post('/post/getPostsByCurrentUser', authentication(), authorization(['normal']), controller.post.getPostsByCurrentUser);
  router.post('/post/modifyIsPublished', authentication(), authorization(['normal']), controller.post.modifyIsPublished);
  router.post('/post/increaseShareCount', controller.post.increaseShareCount);
  router.post('/post/increaseViewCount', controller.post.increaseViewCount);

  // Tags
  router.post('/tag/getTags', controller.tag.getTags);

  // Comments
  router.post('/comment/addComment', authentication(), authorization(['normal']), controller.comment.addComment);
  router.post('/comment/getComment', controller.comment.getComment);
  router.post('/comment/getComments', controller.comment.getComments);
  router.post('/comment/modifyComment', authentication(), authorization(['normal']), controller.comment.modifyComment);
  router.post('/comment/removeComment', authentication(), authorization(['normal']), controller.comment.removeComment);

  // Questions
  router.post('/question/addQuestion', authentication(), authorization(['normal']), controller.question.addQuestion);
  router.post('/question/getQuestion', controller.question.getQuestion);
  router.post('/question/getQuestions', controller.question.getQuestions);
  router.post('/question/getQuestionsByCurrentUser', authentication(), authorization(['normal']), controller.question.getQuestionsByCurrentUser);
  router.post('/question/modifyQuestion', authentication(), authorization(['normal']), controller.question.modifyQuestion);
  router.post('/question/removeQuestion', authentication(), authorization(['normal']), controller.question.removeQuestion);
  router.post('/question/increaseViewCount', controller.question.increaseViewCount);

  // Answers
  router.post('/answer/addAnswer', authentication(), authorization(['normal']), controller.answer.addAnswer);
  router.post('/answer/getAnswer', controller.answer.getAnswer);
  router.post('/answer/getAnswers', controller.answer.getAnswers);
  router.post('/answer/modifyAnswer', authentication(), authorization(['normal']), controller.answer.modifyAnswer);
  router.post('/answer/removeAnswer', authentication(), authorization(['normal']), controller.answer.removeAnswer);

  // Reactions
  router.post('/reaction/addReaction', authentication(), authorization(['normal']), controller.reaction.addReaction);
  router.post('/reaction/countReactions', authentication(false), controller.reaction.countReactions);
  router.post('/reaction/removeReaction', authentication(), authorization(['normal']), controller.reaction.removeReaction);

  // Collections
  router.post('/collection/addCollection', authentication(), authorization(['normal']), controller.collection.addCollection);
  router.post('/collection/getCollections', authentication(), authorization(['normal']), controller.collection.getCollections);
  router.post('/collection/countCollections', authentication(false), controller.collection.countCollections);
  router.post('/collection/removeCollection', authentication(), authorization(['normal']), controller.collection.removeCollection);

  // Feedbacks
  router.post('/feedback/addFeedback', controller.feedback.addFeedback);

  // The following APIs are for admin user
  // Users
  router.post('/admin/user/addUser', controller.user.addUser);
  router.post('/admin/user/getUser', controller.user._getUser);
  router.post('/admin/user/getUsers', controller.user._getUsers);
  router.post('/admin/user/modifyUser', controller.user._modifyUser);
  router.post('/admin/user/removeUser', controller.user._removeUser);

  // Posts
  router.post('/admin/post/addPost', controller.post._addPost);
  router.post('/admin/post/getPost', controller.post._getPost);
  router.post('/admin/post/getPosts', controller.post._getPosts);
  router.post('/admin/post/modifyPost', controller.post._modifyPost);
  router.post('/admin/post/removePost', controller.post._removePost);
  router.post('/admin/post/modifyIsPublished', controller.post._modifyIsPublished);

  // Tags
  router.post('/admin/tag/addTag', controller.tag.addTag);
  router.post('/admin/tag/getTag', controller.tag.getTag);
  router.post('/admin/tag/getTags', controller.tag.getTags);
  router.post('/admin/tag/modifyTag', controller.tag.modifyTag);
  router.post('/admin/tag/removeTag', controller.tag.removeTag);

  // Comments
  router.post('/admin/comment/addComment', controller.comment._addComment);
  router.post('/admin/comment/getComment', controller.comment.getComment);
  router.post('/admin/comment/getComments', controller.comment.getComments);
  router.post('/admin/comment/modifyComment', controller.comment._modifyComment);
  router.post('/admin/comment/removeComment', controller.comment._removeComment);

  // Questions
  router.post('/admin/question/addQuestion', controller.question._addQuestion);
  router.post('/admin/question/getQuestion', controller.question.getQuestion);
  router.post('/admin/question/getQuestions', controller.question.getQuestions);
  router.post('/admin/question/modifyQuestion', controller.question._modifyQuestion);
  router.post('/admin/question/removeQuestion', controller.question._removeQuestion);

  // Answers
  router.post('/admin/answer/addAnswer', controller.answer._addAnswer);
  router.post('/admin/answer/getAnswer', controller.answer.getAnswer);
  router.post('/admin/answer/getAnswers', controller.answer.getAnswers);
  router.post('/admin/answer/modifyAnswer', controller.answer._modifyAnswer);
  router.post('/admin/answer/removeAnswer', controller.answer._removeAnswer);

  // Reactions
  router.post('/admin/reaction/addReaction', controller.reaction._addReaction);
  router.post('/admin/reaction/getReaction', controller.reaction.getReaction);
  router.post('/admin/reaction/getReactions', controller.reaction.getReactions);
  router.post('/admin/reaction/modifyReaction', controller.reaction.modifyReaction);
  router.post('/admin/reaction/removeReaction', controller.reaction._removeReaction);

  // Collections
  router.post('/admin/collection/addCollection', controller.collection._addCollection);
  router.post('/admin/collection/getCollection', controller.collection.getCollection);
  router.post('/admin/collection/getCollections', controller.collection._getCollections);
  router.post('/admin/collection/removeCollection', controller.collection._removeCollection);

  // Feedbacks
  router.post('/admin/feedback/addFeedback', controller.feedback.addFeedback);
  router.post('/admin/feedback/getFeedback', controller.feedback.getFeecback);
  router.post('/admin/feedback/getFeedbacks', controller.feedback.getFeedbacks);
  router.post('/admin/feedback/modifyFeedback', controller.feedback.modifyFeedback);
  router.post('/admin/feedback/removeFeedback', controller.feedback.removeFeedback);
};
