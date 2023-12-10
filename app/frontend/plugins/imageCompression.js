import imageCompression from 'browser-image-compression';

export default {
  async getCompressImageFileAsync(file) {
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 500
    };
    try {
      return await imageCompression(file, options);
    } catch (err) {
      throw err;
    }
  },
  async getDataUrlFromFile(file) {
    try {
      return await imageCompression.getDataUrlFromFile(file);
    } catch (err) {
      throw err;
    }
  }
};