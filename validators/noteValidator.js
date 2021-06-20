const Joi = require('joi');

const title = Joi.string().trim().min(3).max(60);

const body = Joi.string().trim().min(3).max(1_000);

const newNoteSchema = Joi.object({
  title: title.required(),
  body: body.required(),
});

const updateNoteSchema = Joi.object({ title, body }).or('title', 'body');

module.exports = { newNoteSchema, updateNoteSchema };
