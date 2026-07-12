-- Health Hub Database Schema
-- Run this file against your PostgreSQL database to create all tables.
-- psql -U postgres -d healthhub -f init.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role       VARCHAR(50) DEFAULT 'user',
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- DietLogs table
CREATE TABLE IF NOT EXISTS diet_logs (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
  food_name  VARCHAR(255) NOT NULL,
  calories   INTEGER NOT NULL CHECK (calories >= 0 AND calories <= 10000),
  meal_type  VARCHAR(50) NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  log_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- WaterIntake table
CREATE TABLE IF NOT EXISTS water_intake (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  quantity_ml INTEGER NOT NULL CHECK (quantity_ml > 0 AND quantity_ml <= 5000),
  log_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  goal_type   VARCHAR(100),
  progress    INTEGER DEFAULT 0,
  earned_at   TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_diet_logs_user_date ON diet_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);

-- Seed a default admin (password: admin123)
-- bcrypt hash of "admin123"
INSERT INTO admins (email, password_hash)
VALUES ('admin@healthhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (email) DO NOTHING;
