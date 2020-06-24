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

  const answerSchema = new Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    question_id: {
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

  answerSchema.index({ question_id: 1, created_at: -1 });

  return mongoose.model('Answer', answerSchema);
};
