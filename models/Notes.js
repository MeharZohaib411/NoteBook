// Notes.js (or whatever the file name is for the Notes model)
const mongoose = require('mongoose');
const { Schema } = mongoose;

const notesSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'user', }, // Reference the User model
});

const Notes = mongoose.model('Notes', notesSchema);
module.exports = Notes;
