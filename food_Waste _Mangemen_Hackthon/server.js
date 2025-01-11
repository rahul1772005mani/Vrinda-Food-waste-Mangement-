const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Serve static files (like your index.html) from the current directory
app.use(express.static(__dirname));

const uploadFolder = path.join(__dirname, 'saved_photos');

// Ensure the 'saved_photos' folder exists or create it
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// API endpoint for uploading photos
app.post('/upload', (req, res) => {
    const { image } = req.body; // Receive the image data in base64 format

    if (!image) {
        return res.status(400).send('No image provided.');
    }

    // Convert base64 string into binary data
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    
    // Define the file name and path
    const fileName = `photo_1.png`;
    const filePath = path.join(uploadFolder, fileName);

    // Save the photo to the folder
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving photo:', err);
            return res.status(500).send('Failed to save photo.');
        }
        console.log(`Photo saved at: ${filePath}`);
        res.send('Photo saved successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
