import express from 'express';
import { view, find, form, create, edit, update, viewall, deleteUser } from '../controllers/userControllers.js';

const router = express.Router();

// Routes
router.get('/', view);
router.post('/', find);
router.get('/adduser', form);
router.post('/adduser', create);
router.get('/edituser/:id', edit);
router.post('/edituser/:id', update);
router.get('/viewuser/:id', viewall);
router.get('/:id', deleteUser);

export default router;
