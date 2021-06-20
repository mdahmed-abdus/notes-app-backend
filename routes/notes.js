const express = require('express');
const { Note } = require('../models/Note');
const { NotFound } = require('../errors/customErrors');
const validateId = require('../middleware/validateId');
const catchAsyncErr = require('../middleware/catchAsyncErr');
const { auth, active } = require('../middleware/authMiddleware');

const router = express.Router();

// validate id provided in params
router.param('id', validateId);

router.post(
  '/',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const note = new Note({ ...req.body, ownerId: req.session.userId });

    await note.save();

    res.status(201).json({ success: true, message: 'Note created', note });
  })
);

router.get(
  '/:id',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note?.isOwner(req.session.userId)) {
      throw new NotFound('Note with given id was not found');
    }

    res.json({ success: true, message: 'Note found', note });
  })
);

router.put(
  '/:id',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note?.isOwner(req.session.userId)) {
      throw new NotFound('Note with given id was not found');
    }

    // if updated title not provided then use the same title
    // if updated body not provided then use the same body
    const { title = note.title, body = note.body } = req.body;

    note.title = title;
    note.body = body;
    await note.save();

    res.json({ success: true, message: 'Note updated', note });
  })
);

router.delete(
  '/:id',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note?.isOwner(req.session.userId)) {
      throw new NotFound('Note with given id was not found');
    }

    await note.remove();

    res.json({ success: true, message: 'Note deleted', note });
  })
);

module.exports = router;
