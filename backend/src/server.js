import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

// Skip MongoDB connection and start server directly using JSON Storage
app.listen(PORT, () => {
  console.log(`🚀 TravelLoop Backend running in DATABASE-LESS mode!`);
  console.log(`📂 Data is being saved to: backend/database.json`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/v1`);
});
