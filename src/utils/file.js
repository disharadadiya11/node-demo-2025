const path = require('path');
const fs = require('fs').promises;
const { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } = require('./constants');

const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
  }

  if (file.mimetype && !ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only images are allowed');
  }

  return true;
};

const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

const generateFileName = (originalName, prefix = '') => {
  const ext = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const prefixStr = prefix ? `${prefix}-` : '';
  return `${prefixStr}${timestamp}-${random}${ext}`;
};

const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return false;
  }
};

module.exports = {
  validateFile,
  getFileExtension,
  generateFileName,
  deleteFile,
};

