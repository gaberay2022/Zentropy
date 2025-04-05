export interface User {
  user_id: string;
  email: string;
  created_at: Date;
}

export interface Image {
  image_id: string;
  user_id: string;
  image_data: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  is_published: boolean;
  community_title: string | null;
}

export interface Comment {
  comment_id: string;
  image_id: string;
  comment_text: string;
  is_generated: boolean;
  created_at: Date;
}

export interface MeanTitle {
  title_id: string;
  title_text: string;
}

export interface MeanComment {
  comment_id: string;
  comment_text: string;
}