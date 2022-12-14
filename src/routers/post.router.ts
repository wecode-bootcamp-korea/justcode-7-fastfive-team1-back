import express from 'express';
import controllers from '../controllers';
import middleware from '../middlewares/middleware';
import {asyncWrap} from '../utils/myutils';

const {postCtl} = controllers;
const router = express.Router();

// posting route
router.get('/post', asyncWrap(middleware.authMiddleware), asyncWrap(postCtl.getPost));
router.get('/post/:id', asyncWrap(middleware.authMiddleware), asyncWrap(postCtl.getPost));
router.delete('/post/:id', asyncWrap(middleware.authMiddleware), middleware.removeFolder, asyncWrap(postCtl.deletePost));
router.put('/post', asyncWrap(middleware.authMiddleware), asyncWrap(middleware.upload.any()), middleware.removeFolderOnEmptyProperty, asyncWrap(postCtl.putPost));

export default router;