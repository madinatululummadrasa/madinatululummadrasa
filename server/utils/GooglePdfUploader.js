const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const uploadPdfToDrive = async (filePath, fileName) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../config/google-service-account.json'),
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: fileName,
    mimeType: 'application/pdf',
    parents: ['1ZJ402JQMIR8v02XHBmKc_t09dc8Oo-T6'], // 👈 upload inside this folder
  };

  const media = {
    mimeType: 'application/pdf',
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, webViewLink, webContentLink',
  });

  return response.data;
};

module.exports = uploadPdfToDrive;
