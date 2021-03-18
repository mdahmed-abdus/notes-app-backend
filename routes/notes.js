const express = require('express');
const { Note } = require('../models/Note');

const router = express.Router();

router.post('/', async (req, res) => {
  const note = new Note({ ...req.body, ownerId: req.session.userId });

  try {
    await note.save();
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid owner id' });
  }

  res.status(201).json({ success: true, message: 'Note created', note });
});

router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res
      .status(404)
      .json({ success: false, message: 'Note with given id was not found' });
  }

  if (!note.isOwner(req.session.userId)) {
    return res
      .status(404)
      .json({ success: false, message: 'Note with given id was not found' });
  }

  res.json({ success: true, message: 'Note found', note });
});

router.put('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res
      .status(404)
      .json({ success: false, message: 'Note with given id was not found' });
  }

  if (!note.isOwner(req.session.userId)) {
    return res
      .status(404)
      .json({ success: false, message: 'Note with given id was not found' });
  }

  // if updated title not provided then use the same title
  // if updated body not provided then use the same body
  const { title = note.title, body = note.body } = req.body;

  note.title = title;
  note.body = body;
  await note.save();

  res.json({ success: true, message: 'Note updated', note });
});

router.delete('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res
      .status(404)
      .json({ success: false, message: 'Note with given id was not found' });
  }

  if (!note.isOwner(req.session.userId)) {
    return res
      .status(404)
      .json({ success: false, message: 'Note with given id was not found' });
  }

  await note.remove();

  res.json({ success: true, message: 'Note deleted', note });
});

module.exports = router;
