// API endpoint for handling image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file provided.' });
  }

  // Process the uploaded image here if needed (e.g., resizing, compression, etc.)
  // You can save the image URL in your database if necessary

  const imageUrl = `/uploads/${req.file.filename}`;


});
