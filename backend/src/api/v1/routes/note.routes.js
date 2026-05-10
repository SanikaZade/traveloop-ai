import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/note.controller.js';
import { protect } from '../../../middlewares/auth.middleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:noteId')
  .put(updateNote)
  .delete(deleteNote);

export default router;
