const express = require('express');
const { Note } = require('../models/Note');
const { NotFound, BadRequest } = require('../errors/customErrors');
const validateId = require('../middleware/validateId');
const catchAsyncErr = require('../middleware/catchAsyncErr');
const { auth, active } = require('../middleware/authMiddleware');
const {
  newNoteSchema,
  updateNoteSchema,
} = require('../validators/noteValidator');
const { User } = require('../models/User');

const router = express.Router();

// validate id provided in params
router.param('id', validateId);

router.post(
  '/',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = newNoteSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const note = new Note(req.body);
    const user = await User.findById(req.session.userId);

    user.notes.push(note);
    await user.save();

    res.status(201).json({ success: true, message: 'Note created', note });
  })
);

router.get(
  '/:id',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const user = await User.findById(req.session.userId);
    const note = user.notes.find((n, i) => n._id.toString() === req.params.id);

    if (!note) {
      throw new NotFound('Note with given id was not found');
    }

    res.json({ success: true, message: 'Note found', note });
  })
);

router.put(
  '/:id',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const { error: validationError } = updateNoteSchema.validate(req.body);
    if (validationError) {
      throw new BadRequest(validationError.details[0].message);
    }

    const user = await User.findById(req.session.userId);
    const note = user.notes.find((n, i) => n._id.toString() === req.params.id);

    if (!note) {
      throw new NotFound('Note with given id was not found');
    }

    // if updated title not provided then use the same title
    // if updated body not provided then use the same body
    const { title = note.title, body = note.body } = req.body;

    note.title = title;
    note.body = body;
    await user.save();

    res.json({ success: true, message: 'Note updated', note });
  })
);

router.delete(
  '/:id',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const user = await User.findById(req.session.userId);
    const note = user.notes.find((n, i) => n._id.toString() === req.params.id);

    if (!note) {
      throw new NotFound('Note with given id was not found');
    }

    await note.remove();
    await user.save();

    res.json({ success: true, message: 'Note deleted', note });
  })
);

module.exports = router;
