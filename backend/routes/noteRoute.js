const router = require('express').Router();
const Note = require('../db/db.js'); // Assuming you have a Note model defined



router.get('/notes', async (req, res) => {
  const note = await Note.find({})
  res.json(note)
});

router.post('/notes', async (req, res) => {

  const {title , content} = req.body;

  try{
    const note = await Note.create({
      title,
      content
    })
    res.status(201).json({
      message: 'Note created successfully',})
  }catch (error) {
    res.status(500).json({
      message: 'Error creating note',
      error: error.message
    });
  }
  
});

router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put('/notes/:id',async (req, res) => {

const {title, content} = req.body;

try{
const note = await Note.findByIdAndUpdate(req.params.id, {
  title,
  content,
  updatedAt: new Date()
}, { new: true });


if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  }catch (error) {
    res.status(500).json({ error: error.message });
  }

});

module.exports = router;