const mongoose = require('mongoose');

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
  },
  { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = { noteSchema, Note };
