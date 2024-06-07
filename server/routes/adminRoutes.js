import { Router } from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    modifyUser,
    deleteUser,
    addRoles,
    getRoles,
    createRole,
    modifyRole,
    deleteRole,
    removeRoles,
    activateUser,
    deactivateUser
} from '../controllers/AdminController.js';
import ensureAuthenticated from '../middleware/ensureAuthenticated.js';
import checkRole from '../middleware/checkRole.js';
import { uploadPicture } from '../middleware/uploadAttachement.js'; // Import the upload middleware

const router = Router();

// Apply multer middleware to handle picture uploads
router.post('/users', uploadPicture.single('file'), createUser);

// Other routes
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', modifyUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/roles', addRoles);
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles', modifyRole);
router.delete('/roles/:id', deleteRole);
router.delete('/users/:id/roles', removeRoles);
router.put('/activate/:id', activateUser);
router.put('/deactivate/:id', deactivateUser);

export default router;
