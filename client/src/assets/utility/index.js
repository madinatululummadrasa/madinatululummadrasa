import axios from "axios";

export const imageUpload = async (image) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=7241ee19d145a9d8a44d7a27d6d0874a`,
      formData
    );
    console.log("Image uploaded to imgbb:", data.data.display_url);
    return data.data.display_url;
  } catch (err) {
    console.error("❌ imgbb upload failed:", err.response?.data || err.message);
    throw err;
  }
};
