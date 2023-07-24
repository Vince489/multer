const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002; // You can change this to any port number you prefer

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/upload', (req, res) => {
  res.render('upload');
});

// Multer setup to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// API endpoint for handling image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file provided.' });
  }

  // Process the uploaded image here if needed (e.g., resizing, compression, etc.)
  // You can save the image URL in your database if necessary

  // const imageUrl = `http://localhost:3002/uploads/${req.file.filename}`;
  return res.status(200).json({ success: true });});

// Serve the static files from the "uploads" folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// New route to display thumbnails page
app.get('/thumbnails', (req, res) => {
  const thumbnails = [];
  const uploadsPath = path.join(__dirname, 'uploads');

  // Read the "uploads" folder and generate URLs for each image
  fs.readdir(uploadsPath, (err, files) => {
    if (err) {
      console.error('Error reading uploads folder:', err);
      return res.status(500).render('error', { message: 'Error reading uploads folder.' });
    }

    files.forEach((file) => {
      const imageUrl = `/uploads/${file}`;
      thumbnails.push(imageUrl);
    });

    // Pass the thumbnail URLs to the EJS template
    res.render('thumbnails', { thumbnails });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
