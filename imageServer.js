const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001; // Use port 3000 or a port specified in the environment variable

// Serve static files from a directory
app.use('/images', express.static(path.join(__dirname, '../multimedia-images')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});