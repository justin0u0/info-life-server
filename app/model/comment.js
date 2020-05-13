'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const fileSchema = new Schema({
    file_type: {
      type: String,
      required: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
  }, {
    _id: false,
    strict: 'throw',
  });

  const commentSchema = new Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    parent_type: {
      type: String,
      required: true,
      validator: {
        validate: (v) => ['post', 'comment'].includes(v),
        message: (type) => `${type} is not a valid comment parent_type`,
      },
    },
    parent_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [fileSchema],
    },
    created_at: {
      type: Number,
      required: true,
    },
    updated_at: {
      type: Number,
    },
  }, {
    strict: 'throw',
  });

  commentSchema.index({ parent_type: 1, parent_id: 1 });

  return mongoose.model('Comment', commentSchema);
};
