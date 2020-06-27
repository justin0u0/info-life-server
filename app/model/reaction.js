'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const reactionSchema = new Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    source_type: {
      type: String,
      required: true,
      validate: {
        validator: (v) => ['post', 'question', 'answer'].includes(v),
        message: (type) => `${type} is not a valid reaction source_type`,
      },
    },
    source_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validate: {
        validator: (v) => ['like', 'dislike'].includes(v),
        message: (type) => `${type} is not a valid reaction type`,
      },
    },
  }, {
    strict: 'throw',
  });

  reactionSchema.index({ source_type: 1, source_id: 1, user_id: 1 }, { unique: true });

  return mongoose.model('Reaction', reactionSchema);
};
