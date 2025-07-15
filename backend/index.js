const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const mainRouter = require('./routes/index.js');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Note = require('./db/db.js');
require('dotenv').config();


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials:true
  }
});

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-note', async (noteId) => {
    socket.join(noteId);
    console.log(`User ${socket.id} joined note ${noteId}`);
    
    try {
      const note = await Note.findById(noteId);
      if (note) {
        socket.emit('note-content', {
          title: note.title,
          content: note.content
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Note not found' });
    }
  });

  socket.on('update-room', async (data) => {
    const { noteId, content, title } = data;
    
    try {
      await Note.findByIdAndUpdate(noteId, {
        content: content,
        title: title,
        updatedAt: new Date()
      });
      
      socket.to(noteId).emit('content-updated', {
        content: content,
        title: title
      });
      
    } catch (error) {
      socket.emit('error', { message: 'Failed to update note' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use('/api/v1', mainRouter);

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
