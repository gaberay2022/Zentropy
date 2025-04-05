import { Router, Request, Response } from 'express';
import { dbService } from '../models/db.service';

const router = Router();

interface CreateUserRequest {
  email: string;
}

interface CreateImageRequest {
  userId: string;
  imageData: string;
  title: string;
}

interface UpdateImageRequest {
  imageData: string;
  title: string;
}

interface ImageParams {
  imageId: string;
}

interface UserParams {
  userId: string;
}

interface CommentRequest {
  commentText: string;
}

interface QueryParams {
  limit?: string;
  offset?: string;
  email?: string;
}

// User routes
router.post('/users', async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
  try {
    const { email } = req.body;
    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email);
    if (existingUser) {
      res.json(existingUser);
      return;
    }
    const user = await dbService.createUser(email);
    res.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/users', async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const { email } = req.query;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }
    const user = await dbService.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Image routes
router.post('/images', async (req: Request<{}, {}, CreateImageRequest>, res: Response) => {
  try {
    const { userId, imageData, title } = req.body;
    const image = await dbService.createImage(userId, imageData, title);
    res.json(image);
  } catch (error) {
    console.error('Error creating image:', error);
    res.status(500).json({ error: 'Failed to create image' });
  }
});

router.put<ImageParams>('/images/:imageId', async (req: Request<ImageParams, {}, UpdateImageRequest>, res: Response) => {
  try {
    const { imageId } = req.params;
    const { imageData, title } = req.body;
    const image = await dbService.updateImage(imageId, imageData, title);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

router.post<ImageParams>('/images/:imageId/publish', async (req: Request<ImageParams>, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await dbService.publishImage(imageId);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    await dbService.generateMeanComment(imageId);
    res.json(image);
  } catch (error) {
    console.error('Error publishing image:', error);
    res.status(500).json({ error: 'Failed to publish image' });
  }
});

router.get<ImageParams>('/images/:imageId', async (req: Request<ImageParams>, res: Response) => {
  try {
    const { imageId } = req.params;
    const image = await dbService.getImageById(imageId);
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.json(image);
  } catch (error) {
    console.error('Error getting image:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
});

router.get<UserParams>('/users/:userId/images', async (req: Request<UserParams>, res: Response) => {
  try {
    const { userId } = req.params;
    const images = await dbService.getUserImages(userId);
    res.json(images);
  } catch (error) {
    console.error('Error getting user images:', error);
    res.status(500).json({ error: 'Failed to get user images' });
  }
});

router.get('/community/images', async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const limit = parseInt(req.query.limit || '10');
    const offset = parseInt(req.query.offset || '0');
    const images = await dbService.getCommunityImages(limit, offset);
    res.json(images);
  } catch (error) {
    console.error('Error getting community images:', error);
    res.status(500).json({ error: 'Failed to get community images' });
  }
});

// Comment routes
router.post<ImageParams>('/images/:imageId/comments', async (req: Request<ImageParams, {}, CommentRequest>, res: Response) => {
  try {
    const { imageId } = req.params;
    const { commentText } = req.body;
    const comment = await dbService.addComment(imageId, commentText);
    res.json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

router.get<ImageParams>('/images/:imageId/comments', async (req: Request<ImageParams>, res: Response) => {
  try {
    const { imageId } = req.params;
    const comments = await dbService.getImageComments(imageId);
    res.json(comments);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ error: 'Failed to get comments' });
  }
});

// Generate mean comment
router.post<ImageParams>('/images/:imageId/generate-comment', async (req: Request<ImageParams>, res: Response) => {
  try {
    const { imageId } = req.params;
    const comment = await dbService.generateMeanComment(imageId);
    res.json(comment);
  } catch (error) {
    console.error('Error generating mean comment:', error);
    res.status(500).json({ error: 'Failed to generate mean comment' });
  }
});

export default router;