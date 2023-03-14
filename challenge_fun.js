function get_128bits () {
  const crypto = require('crypto');
  const numBytes = 16; // 128 bits = 16 bytes
  const buffer = crypto.randomBytes(numBytes);
  const hexString = buffer.toString('hex');
  return(hexString);
};

module.exports = {
  get_128bits: get_128bits
};
