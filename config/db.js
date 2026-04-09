const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // Required for Render Postgres
});

async function initializeDatabase() {
    try {
        const client = await pool.connect();
        
        // Auto-create users table if it does not exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL
            );
        `);
        
        console.log('Database connected and users table verified.');
        client.release();
    } catch (err) {
        console.error('Database connection or initialization failed:', err);
    }
}

initializeDatabase();

module.exports = pool;
