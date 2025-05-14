const UploadPdfToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "notice_unsigned"); // unsigned preset
    data.append("folder", "notice"); // optional, for organizing uploads
  
    const res = await fetch("https://api.cloudinary.com/v1_1/dzrf0oslv/raw/upload", {
      method: "POST",
      body: data,
    });
  
    const result = await res.json();
    return result.secure_url; // This is the URL to the uploaded PDF
  };
  
  export default UploadPdfToCloudinary;
  