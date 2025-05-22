const path = require('path');
require('dotenv').config();

const config = {
  port: process.env.PORT || 5678,
  host: process.env.HOST || 'http://localhost',
  basePath: process.env.BASE_PATH || '',
  
  // Configuration des chemins
  paths: {
    images: path.join(__dirname, '../images'),
    public: path.join(__dirname, '../public'),
    swagger: path.join(__dirname, '../public/swagger'),
  },

  // Configuration de la base de données
  database: {
    dialect: 'sqlite',
    storage: './database.sqlite'
  },

  // Configuration des URLs
  urls: {
    getImageUrl: (filename) => {
      return `${process.env.HOST}${process.env.BASE_PATH}/images/${filename}`;
    }
  }
};

module.exports = config; 