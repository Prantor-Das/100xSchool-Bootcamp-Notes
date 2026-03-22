import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from './src/config/database.js';

// Connect to the database
connectDB();

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});