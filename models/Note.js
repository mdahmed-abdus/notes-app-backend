const mongoose = require('mongoose');
const { User } = require('./User');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 60,
    },
    body: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 1_000,
    },
    ownerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

// check if user id exists before saving
noteSchema.pre('save', async function (next) {
  const userExists = await User.exists({ _id: this.ownerId });

  if (userExists) {
    return next();
  }

  next(new Error('Invalid user id'));
});

// method to validate owner
noteSchema.methods.isOwner = function (userId) {
  return userId === this.ownerId.toString();
};

const Note = mongoose.model('Note', noteSchema);

module.exports = { noteSchema, Note };
