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

  const questionSchema = new Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    tag_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
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
    is_solved: {
      type: Boolean,
      required: true,
    },
    best_answer_id: {
      type: mongoose.Types.ObjectId,
    },
    created_at: {
      type: Number,
      required: true,
    },
    updated_at: {
      type: Number,
    },
  });

  questionSchema.index({ user_id: 1 });
  questionSchema.index({ tag_id: 1, created_at: -1 });
  questionSchema.index({ is_solved: 1, created_at: -1 });

  return mongoose.model('Question', questionSchema);
};
