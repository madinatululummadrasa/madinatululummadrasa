// src/assets/utility/UploadPdfToGoogleDrive.js

import axios from 'axios'

const UploadPdfToGoogleDrive = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('http://localhost:8000/upload-google-drive', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data?.pdfUrl // Assuming your backend sends back the public URL
  } catch (error) {
    console.error("Google Drive upload failed", error)
    throw new Error("Google Drive upload failed")
  }
}

export default UploadPdfToGoogleDrive
