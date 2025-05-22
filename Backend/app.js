const express = require('express');
const path = require('path');
const cors = require('cors')
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const config = require('./config/config');
const swaggerUiDist = require('swagger-ui-dist');

const swaggerDocs = yaml.load('swagger.yaml')
const app = express()

// Middleware de base
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Servir les fichiers statiques
app.use('/images', express.static(config.paths.images))
app.use('/public', express.static(config.paths.public))

// Routes de l'API
const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');
const adminRoutes = require('./routes/admin.routes');

db.sequelize.sync().then(() => console.log('Base de données prête'));

app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api/admin', adminRoutes);

// Configuration Swagger UI
const swaggerPath = `${config.basePath}/api-docs`;

// 1. Servir TOUS les assets (y compris swagger.yaml) depuis public/swagger
//    Assure-toi que swagger.yaml est aussi copié dans public/swagger
app.use(swaggerPath, express.static(path.join(__dirname, 'public/swagger')));

// 2. Initialiser Swagger UI
app.use(swaggerPath, swaggerUi.serve); // Doit venir APRES le static
app.use(swaggerPath, swaggerUi.setup(null, { // Laisse swaggerDocs à null, il le prendra depuis l'URL
  explorer: true,
  swaggerOptions: {
    url: `${swaggerPath}/swagger.yaml`, // Chemin vers le YAML servi par le static ci-dessus
    persistAuthorization: true
  },
  customSiteTitle: "API Documentation - Sophie Bluel",
  // customfavIcon: `${swaggerPath}/favicon-32x32.png`, // Déjà servi par le static
  // customCssUrl: `${swaggerPath}/swagger-ui.css`    // Déjà servi par le static
}));

module.exports = app;