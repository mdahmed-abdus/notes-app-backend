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

noteSchema.pre('save', async function (next) {
  const userExists = await User.exists({ _id: this.ownerId });

  if (userExists) {
    return next();
  }

  next(new Error('Invalid user id'));
});

const Note = mongoose.model('Note', noteSchema);

module.exports = { noteSchema, Note };
