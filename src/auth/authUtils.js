'use strict';

const JWT = require('jsonwebtoken');
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    console.log('payload', payload)
    console.log('publicKey', publicKey)
    console.log('privateKey', privateKey)

    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });
    
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    return;

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
