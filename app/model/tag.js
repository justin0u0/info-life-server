'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const tagSchema = new Schema({
    name: {
      type: String,
    },
    color: {
      type: Number,
    },
  }, {
    strict: 'throw',
  });

  tagSchema.index({ name: 1 }, { unique: true });
  return mongoose.model('Tag', tagSchema);
};
