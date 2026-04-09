# Database Configuration for Render Deployment

## Option 1: Render MySQL (Recommended for this app)
1. Create a Render MySQL database service in your Render dashboard
2. Get connection details from Render dashboard
3. Update render.yaml with these values:
   - DB_HOST: from Render database (e.g., your-db.onrender.com)
   - DB_USER: from Render database
   - DB_PASSWORD: from Render database
   - DB_NAME: from Render database
   - DB_PORT: 3306

## Option 2: Render PostgreSQL
1. Create a Render PostgreSQL database service
2. Update config.php to use PostgreSQL (uncomment the pg section)
3. Update render.yaml with:
   - PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT

## Important Notes
- Render provides database connection strings in the "Connection Info" section
- Database credentials are automatically set as environment variables
- Your app will restart automatically when deployed
- The free tier sleeps after 15 mins of inactivity
