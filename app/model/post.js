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
  });

  const postSchema = new Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    tag_id: {
      type: mongoose.Types.ObjectId,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [fileSchema],
    },
    cover: {
      type: fileSchema,
    },
    created_at: {
      type: Number,
      required: true,
    },
    published_at: {
      type: Number,
    },
    updated_at: {
      type: Number,
    },
    share_count: {
      type: Number,
      required: true,
    },
    view_count: {
      type: Number,
      required: true,
    },
  }, {
    strict: 'throw',
  });

  postSchema.index({ user_id: 1 });
  postSchema.index({ tag_id: 1 });

  return mongoose.model('Post', postSchema);
};
