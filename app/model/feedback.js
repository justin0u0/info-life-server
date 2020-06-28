'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const feedbackSchema = new Schema({
    email: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  }, {
    strict: 'throw',
  });

  return mongoose.model('Feedback', feedbackSchema);
};
