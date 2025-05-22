const express = require('express');
const path = require('path');
const cors = require('cors')
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const config = require('./config/config');
const swaggerUiDist = require('swagger-ui-dist');

const swaggerDocs = yaml.load(path.join(__dirname, 'public/swagger/swagger.yaml'));
console.log('Swagger YAML chargé :', JSON.stringify(swaggerDocs, null, 2));
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
app.use('/api/images', express.static(config.paths.images));

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
app.use(swaggerPath, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customSiteTitle: "API Documentation - Sophie Bluel",
}));

module.exports = app;