
'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  app.validator.addRule('object_id', (rule, value) => {
    try {
      mongoose.Types.ObjectId(value);
    } catch (error) {
      return 'invalid object id';
    }
  });
};
