'use strict';

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfodata } = require('../utils');
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    // a;
    // lean : return object javascript thuan tuy
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError('Shop already registered');
    }
    // salt = 10 do kho 10
    const passwordHash = await bcrypt.hash(password, 10);
    console.log('passwordHash', passwordHash);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    console.log('newShop', newShop);

    if (newShop) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1', //pkcs8
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });


      // created privateKey, publicKey

      // const privateKey = crypto.randomBytes(64).toString('hex');
      // const publicKey = crypto.randomBytes(64).toString('hex');
      

      console.log('privateKey', privateKey);
      console.log('publicKey', publicKey);
      // return;

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        // privateKey,
      });
      if (!publicKeyString) {
        throw new BadRequestError('publicKeyString error');
      }
      const publicKeyObject = crypto.createPublicKey(publicKeyString);
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyObject,
        privateKey
      );
      console.log('tokens', tokens)
      return {
        code: 201,
        metadata: {
          shop: getInfodata({
            fields: ['name', 'email', '_id'],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    //   console.log('error', error);
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   };
    // }
  };

  /* 
  1 - check email in dbs
  2 - match password
  3 - create AT vs RT and save
  4 - generate tokens
  5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    // 1 check email in dbs
    if (!foundShop) {
      throw new BadRequestError('Shop not registerd');
    }
    // 2  match password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication Error');
    }
    // 3
    // create privateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // 4 - generate tokens
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfodata({
        fields: ['name', 'email', '_id'],
        object: foundShop,
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
