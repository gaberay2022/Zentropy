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

    // Try to get user by email
    let user = await dbService.getUserByEmail(email);

    // If user doesn't exist, create them
    if (!user) {
      user = await dbService.createUser(email);
    }

    res.json(user);
  } catch (error) {
    console.error('Error getting/creating user:', error);
    res.status(500).json({ error: 'Failed to get/create user' });
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

export default router;