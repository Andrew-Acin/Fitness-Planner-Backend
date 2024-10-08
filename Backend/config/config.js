require('dotenv').config(); // Ensure environment variables are loaded

module.exports = {
  development: {
    username: process.env.DB_USER,           // Your DB_USER variable
    password: process.env.DB_PASSWORD,       // Your DB_PASSWORD variable
    database: process.env.DB_NAME,           // Your DB_NAME variable
    host: process.env.DB_HOST,               // Your DB_HOST variable
    port: process.env.PGPORT || 5432,        // You can still use PGPORT, defaulting to 5432
    dialect: process.env.DB_DIALECT || 'postgres',  // Your DB_DIALECT
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false           // Disable strict SSL checking for Railway
      }
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.PGPORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
