# PHP Authentication App for Render

A simple user authentication system with admin and user roles.

## Features
- User registration and login
- Role-based access control (admin/user)
- Session management
- MySQL/PostgreSQL database support

## Local Development

1. Install dependencies:
```bash
composer install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your local database credentials
```

3. Create database and users table:
```sql
CREATE DATABASE user_db;
USE user_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Start local server:
```bash
php -S localhost:8000 -t public
```

5. Visit `http://localhost:8000`

## Deployment to Render

### Prerequisites
- GitHub repository with your code pushed
- Render account (sign up at [render.com](https://render.com))

### Steps

1. **Create a Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Settings:
     - Name: `php-auth-app` (or your preferred name)
     - Environment: `PHP`
     - Plan: Free
     - Build Command: `composer install --no-dev --optimize-autoloader`
     - Start Command: `php -S 0.0.0.0:$PORT -t public`

2. **Add a Database** (Recommended: Render MySQL)
   - Go to Render Dashboard → New → Database
   - Select "MySQL"
   - Choose Free plan
   - Note: Database creation takes 2-3 minutes

3. **Configure Environment Variables**
   In your Web Service settings, add these environment variables:
   ```
   DB_HOST = <your-database-host> (from Render DB "Connection Info")
   DB_USER = <your-database-user>
   DB_PASSWORD = <your-database-password>
   DB_NAME = <your-database-name>
   DB_PORT = 3306
   APP_ENV = production
   APP_DEBUG = false
   ```

   Render automatically provides these in your database's "Connection Info" section.

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Wait for deployment to complete (5-10 minutes)

5. **Initialize Database**
   After deployment, run this SQL in your Render database:
   ```sql
   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       role ENUM('user', 'admin') DEFAULT 'user',
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. **Access Your App**
   - Your app will be available at: `https://your-service-name.onrender.com`
   - Register a user and manually set role to 'admin' in database for admin access

## Important Notes

- **Free Tier**: Render free services sleep after 15 minutes of inactivity. First request after sleep may take 30+ seconds.
- **Database**: Free MySQL has 90-day retention. Back up your data regularly.
- **Custom Domain**: Add custom domain in Render dashboard if needed.
- **SSL**: Render provides automatic HTTPS.

## File Structure
```
├── public/              # Web root
│   ├── index.php       # Login page
│   ├── login_register.php  # Auth handler
│   ├── admin_page.php  # Admin dashboard
│   ├── user_page.php   # User dashboard
│   ├── logout.php      # Logout handler
│   ├── config.php      # Database config
│   ├── style.css       # Styles
│   └── script.js       # Client-side JS
├── composer.json       # PHP dependencies
├── render.yaml         # Render configuration
└── README.md          # This file
```

## Troubleshooting

**Database Connection Error**
- Verify DB credentials in Render environment variables
- Check Render database is running (status should be "Available")
- Ensure database has accepted connections from your web service

**404 Errors**
- Ensure start command includes `-t public`
- Render automatically serves from document root

**Blank Page**
- Check Render logs in dashboard → Logs
- Verify PHP version compatibility (PHP 8.0+ required)

## Security Notes

This is a basic demo application. For production use:
- Implement prepared statements/SQL injection prevention
- Add CSRF protection
- Implement rate limiting
- Add password strength validation
- Use HTTPS-only cookies
- Consider using a PHP framework (Laravel, Symfony) for production apps
