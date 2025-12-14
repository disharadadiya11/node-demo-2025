const crypto = require('crypto');
const { JWT_SECRET } = require('../config/env');

const hashPassword = async (password) => {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
};

const verifyPassword = async (password, hash) => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
};

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashString = (text) => {
  return crypto.createHash('sha256').update(text).digest('hex');
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  hashString,
};

