-- Migration: 001_create_users_table
-- Created at: 2024-01-01

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
