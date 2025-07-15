const mongoose = require('mongoose');
require('dotenv').config();


MONGODB_URI=process.env.MONGODB_URI || 'mongodb://localhost:27017/notes';

// / Connect to MongoDB

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


const noteSchema = new mongoose.Schema({  title: String,
  content: String, updatedAt:Date})


const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
