'use strict';

const mongoose = require('mongoose'); // Erase if already required
const { Schema } = mongoose;
const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';
// Declare the Schema of the Mongo model
const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissons: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);
