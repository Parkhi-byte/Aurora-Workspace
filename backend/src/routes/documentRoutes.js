import express from 'express';
import { getDocuments, uploadDocument, deleteDocument, createFolder, renameFolder, deleteFolder } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getDocuments);

router.post('/upload', uploadDocument);

router.post('/folder', createFolder);
router.route('/folder/:id')
    .put(renameFolder)
    .delete(deleteFolder);

router.route('/:id')
    .delete(deleteDocument);

export default router;
