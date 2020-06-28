'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const tagSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: Number,
      required: true,
      default: 0,
    },
    type: {
      type: String,
      validator: {
        validate: (v) => ['post', 'question'].includes(v),
        message: (type) => `${type} is not a valid tag type`,
      },
      required: true,
    },
  }, {
    strict: 'throw',
  });

  tagSchema.index({ type: 1, name: 1 }, { unique: true });
  tagSchema.index({ type: 1 });

  return mongoose.model('Tag', tagSchema);
};
