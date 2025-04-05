-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    image_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    image_data TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT false,
    community_title VARCHAR(255),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_id UUID NOT NULL,
    comment_text TEXT NOT NULL,
    is_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_image FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE
);

-- Create mean_titles table
CREATE TABLE IF NOT EXISTS mean_titles (
    title_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title_text VARCHAR(255) NOT NULL
);

-- Create mean_comments table
CREATE TABLE IF NOT EXISTS mean_comments (
    comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    comment_text TEXT NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_images_updated_at ON images;
CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample mean titles
INSERT INTO mean_titles (title_text) VALUES
    ('Wow, Get a Load of This Malarkey'),
    ('Oh Dear, What Have We Here?'),
    ('Behold: A Masterpiece... Said No One Ever'),
    ('Well, Someone Had Too Much Free Time'),
    ('Is This Art or Did Your Computer Sneeze?'),
    ('Ah Yes, Very... Interesting'),
    ('This is What Happens When You Skip Art Class'),
    ('A True Testament to Human Perseverance... Or Confusion'),
    ('Your Eyes Are Not Deceiving You, It Really Looks Like That'),
    ('When Abstract Art Meets a Sugar Rush');

-- Insert sample mean comments
INSERT INTO mean_comments (comment_text) VALUES
    ('Thou call''st this art? Mine eyes have seen better drawings in cave paintings!'),
    ('Prithee, what manner of visual chaos doth mine eyes witness?'),
    ('Forsooth! A child''s scribbles would show more promise!'),
    ('Methinks thou should''st stick to finger painting, good sir/madam'),
    ('O what fresh visual disaster is this?'),
    ('Alas, poor artwork, I knew it... could have been better'),
    ('By my troth, this piece doth remind me of a jester''s failed jest'),
    ('Thou hast managed to insult both art and geometry in one fell swoop'),
    ('Verily, I say this piece belongs in the depths of a digital dungeon'),
    ('Hark! Is this what passes for creativity these days?');