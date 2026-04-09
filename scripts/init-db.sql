-- Database initialization script for Render
-- Run this SQL in your Render MySQL database after deployment

CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert default admin user (password: admin123)
-- IMPORTANT: Change password after first login!
-- INSERT INTO users (name, email, password, role) VALUES
-- ('Admin', 'admin@example.com', '$2y$10$YourHashedPasswordHere', 'admin');
