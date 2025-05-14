// backend/routes/uploadGoogleDrive.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Storage config for multer (temporary local)
const upload = multer({ dest: 'uploads/' });

// Auth config
const KEYFILEPATH = path.join(__dirname, '../../client/config/google-service-account.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const fileName = req.file.originalname;

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: fs.createReadStream(filePath),
      },
      fields: 'id, webViewLink, webContentLink',
    });

    // Make the file public (optional)
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Clean up temp file
    fs.unlinkSync(filePath);

    res.json({ pdfUrl: response.data.webViewLink }); // you can also return webContentLink for download
  } catch (err) {
    console.error('Upload to Google Drive failed:', err);
    res.status(500).send('Failed to upload to Google Drive');
  }
});

module.exports = router;
