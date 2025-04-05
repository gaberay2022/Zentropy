import { pool } from '../index';
import { User, Image, Comment, MeanTitle, MeanComment } from './db.types';

export class DatabaseService {
  // User operations
  async createUser(email: string): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (email) VALUES ($1) RETURNING *',
      [email]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  // Image operations
  async createImage(userId: string, imageData: string, title: string): Promise<Image> {
    const result = await pool.query(
      'INSERT INTO images (user_id, image_data, title) VALUES ($1, $2, $3) RETURNING *',
      [userId, imageData, title]
    );
    return result.rows[0];
  }

  async updateImage(imageId: string, imageData: string, title: string): Promise<Image | null> {
    const result = await pool.query(
      'UPDATE images SET image_data = $1, title = $2 WHERE image_id = $3 RETURNING *',
      [imageData, title, imageId]
    );
    return result.rows[0] || null;
  }

  async publishImage(imageId: string): Promise<Image | null> {
    // Get a random mean title
    const titleResult = await pool.query(
      'SELECT title_text FROM mean_titles ORDER BY RANDOM() LIMIT 1'
    );
    const communityTitle = titleResult.rows[0]?.title_text;

    const result = await pool.query(
      'UPDATE images SET is_published = true, community_title = $1 WHERE image_id = $2 RETURNING *',
      [communityTitle, imageId]
    );
    return result.rows[0] || null;
  }

  async getImageById(imageId: string): Promise<Image | null> {
    const result = await pool.query('SELECT * FROM images WHERE image_id = $1', [imageId]);
    return result.rows[0] || null;
  }

  async getUserImages(userId: string): Promise<Image[]> {
    const result = await pool.query('SELECT * FROM images WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  }

  async getCommunityImages(limit: number = 10, offset: number = 0): Promise<Image[]> {
    const result = await pool.query(
      'SELECT * FROM images WHERE is_published = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  // Comment operations
  async addComment(imageId: string, commentText: string, isGenerated: boolean = false): Promise<Comment> {
    const result = await pool.query(
      'INSERT INTO comments (image_id, comment_text, is_generated) VALUES ($1, $2, $3) RETURNING *',
      [imageId, commentText, isGenerated]
    );
    return result.rows[0];
  }

  async getImageComments(imageId: string): Promise<Comment[]> {
    const result = await pool.query(
      'SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at DESC',
      [imageId]
    );
    return result.rows;
  }

  async generateMeanComment(imageId: string): Promise<Comment> {
    // Get a random mean comment
    const commentResult = await pool.query(
      'SELECT comment_text FROM mean_comments ORDER BY RANDOM() LIMIT 1'
    );
    const meanComment = commentResult.rows[0]?.comment_text;

    // Add the comment to the image
    return this.addComment(imageId, meanComment, true);
  }

  // Helper methods
  async getRandomMeanTitle(): Promise<string> {
    const result = await pool.query('SELECT title_text FROM mean_titles ORDER BY RANDOM() LIMIT 1');
    return result.rows[0]?.title_text || 'Untitled Masterpiece';
  }

  async getRandomMeanComment(): Promise<string> {
    const result = await pool.query('SELECT comment_text FROM mean_comments ORDER BY RANDOM() LIMIT 1');
    return result.rows[0]?.comment_text || 'No comment...';
  }
}

export const dbService = new DatabaseService();