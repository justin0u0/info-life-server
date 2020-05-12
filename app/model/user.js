
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

  const profileSchema = new Schema({
    url: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  });

  const profilesSchema = new Schema({
    facebook: {
      type: profileSchema,
    },
    gitlab: {
      type: profileSchema,
    },
    github: {
      type: profileSchema,
    },
    bitbucket: {
      type: profileSchema,
    },
  });

  const userSchema = new Schema({
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      validate: {
        validator: (v) => ['normal', 'admin'].includes(v),
        message: (role) => `${role} is not a valid role`,
      },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: fileSchema,
    },
    profiles: {
      type: profilesSchema,
    },
  }, {
    strict: 'throw',
  });

  userSchema.index({ username: 1 }, { unique: true });

  return mongoose.model('User', userSchema);
};
