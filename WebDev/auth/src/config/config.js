import dotenv from 'dotenv';

dotenv.config();

// List all required environment variables
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
];

// Validate them
const missingVars = requiredEnvVars.filter(
  (key) => !process.env[key]
);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}

// Config object
const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default config;