'use strict';

const JWT = require('jsonwebtoken');
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, privateKey, (err, decode) => {
      if (err) {
        console.log('err', err);
      } else {
        console.log('decode', decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

module.exports = {
  createTokenPair,
};
