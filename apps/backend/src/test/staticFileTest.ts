// Test script to verify static file serving
import express from 'express';
import path from 'path';

const app = express();
const port = 3002;

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Static File Test</title>
      </head>
      <body>
        <h1>Static File Test</h1>
        <p>Testing if mindwise-chat.js is being served correctly.</p>
        <script src="/mindwise-chat.js"></script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Static file test server running at http://localhost:${port}`);
});