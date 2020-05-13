
'use strict';

module.exports = (app) => {
  const { mongoose } = app;

  app.validator.addRule('object_id', (rule, value) => {
    try {
      mongoose.Types.ObjectId(value);
    } catch (error) {
      return 'Invalid parameter, invalid object id';
    }
  });

  app.validator.addRule('file', (rule, value) => {
    const properties = ['file_type', 'file_name', 'file_url'];
    for (const property of properties) {
      if (!value[property] || typeof value[property] !== 'string') {
        return 'Invalid parameter, invalid file';
      }
    }
  });
};
