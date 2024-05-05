import express from "express";
import {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} from "../controllers/Roles.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/roles', verifyUser, adminOnly, getRoles);
router.get('/roles/:id', verifyUser, adminOnly, getRoleById);
router.post('/roles', verifyUser, adminOnly, createRole);
router.patch('/roles/:id', verifyUser, adminOnly, updateRole);
router.delete('/roles/:id', verifyUser, adminOnly, deleteRole);

export default router;
