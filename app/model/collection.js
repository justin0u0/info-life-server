'use strict';

module.exports = (app) => {
  const { mongoose } = app;
  const { Schema } = mongoose;

  const collectionSchema = new Schema({
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    post_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  }, {
    strict: 'throw',
  });

  collectionSchema.index({ post_id: 1 });
  collectionSchema.index({ user_id: 1 });
  collectionSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

  return mongoose.model('Collection', collectionSchema);
};
