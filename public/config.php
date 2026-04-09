<?php
// Database configuration for Render
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';
$database = getenv('DB_NAME') ?: 'user_db';
$port = getenv('DB_PORT') ?: 3306;

// For Render PostgreSQL (uncomment if using PostgreSQL)
// $host = getenv('PGHOST') ?: 'localhost';
// $user = getenv('PGUSER') ?: 'postgres';
// $password = getenv('PGPASSWORD') ?: '';
// $database = getenv('PGDATABASE') ?: 'user_db';
// $port = getenv('PGPORT') ?: 5432;

// Create database connection (MySQL)
$conn = new mysqli($host, $user, $password, $database, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8mb4");
?>
