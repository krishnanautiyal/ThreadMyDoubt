-- create_postgres_user_question_tables.sql
-- Run this in pgAdmin for your local PostgreSQL database.

CREATE TYPE auth_provider AS ENUM ('local', 'google');

CREATE TABLE users (
  id text PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  password text,
  role text NOT NULL DEFAULT 'Community Member',
  bio text NOT NULL DEFAULT '',
  reputation integer NOT NULL DEFAULT 0,
  questions_count integer NOT NULL DEFAULT 0,
  answers_count integer NOT NULL DEFAULT 0,
  upvotes integer NOT NULL DEFAULT 0,
  downvotes integer NOT NULL DEFAULT 0,
  profile_picture text NOT NULL DEFAULT 'https://ui-avatars.com/api/?name=User&background=random',
  achievements text[] NOT NULL DEFAULT '{}',
  joined_at timestamptz NOT NULL DEFAULT now(),
  google_id text UNIQUE,
  auth_provider auth_provider NOT NULL DEFAULT 'local'
);

CREATE TABLE questions (
  id text PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL,
  image text,
  author_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  community_id text,
  best_answer_id text,
  tags text[] NOT NULL DEFAULT '{}',
  upvotes integer NOT NULL DEFAULT 0,
  downvotes integer NOT NULL DEFAULT 0,
  answers_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
