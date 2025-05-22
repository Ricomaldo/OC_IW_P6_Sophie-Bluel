const db = require('../models');
const fs = require('fs');
const path = require('path');

exports.resetDatabase = async (req, res) => {
    try {
        // Supprimer tous les enregistrements des tables dans le bon ordre
        await db.works.destroy({ where: {} });
        await db.categories.destroy({ where: {} });
        await db.users.destroy({ where: {} });

        // Supprimer toutes les images du dossier images sauf celles par défaut
        const imagesDir = path.join(__dirname, '../images');
        const defaultImages = [
            'sophie-bluel.png',
            'abajour-tahina.png',
            'appartement-paris-v.png',
            'restaurant-sushisen-londres.png',
            'la-balisiere.png',
            'structures-thermopolis.png',
            'appartement-paris-x.png',
            'le-coteau-cassis.png',
            'villa-ferneze.png',
            'appartement-paris-xviii.png',
            'hotel-first-arte-new-delhi.png'
        ];
        
        const files = fs.readdirSync(imagesDir);
        for (const file of files) {
            if (!defaultImages.includes(file)) {
                fs.unlinkSync(path.join(imagesDir, file));
            }
        }

        // Copier les images par défaut depuis le dossier de sauvegarde si elles n'existent pas
        const backupDir = path.join(__dirname, '../backup/images');
        for (const image of defaultImages) {
            const targetPath = path.join(imagesDir, image);
            const sourcePath = path.join(backupDir, image);
            if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, targetPath);
            }
        }

        // Réinitialiser avec les catégories par défaut
        const categories = await db.categories.bulkCreate([
            { name: 'Objets' },
            { name: 'Appartements' },
            { name: 'Hotels & restaurants' }
        ]);

        // Récupérer les IDs des catégories créées
        const categoriesMap = {};
        categories.forEach(cat => {
            categoriesMap[cat.name] = cat.id;
        });

        // Créer les projets initiaux avec les bons IDs de catégorie
        const projetsInitiaux = [
            { title: 'Abajour Tahina', categoryId: categoriesMap['Objets'], imageUrl: 'abajour-tahina.png' },
            { title: 'Appartement Paris V', categoryId: categoriesMap['Appartements'], imageUrl: 'appartement-paris-v.png' },
            { title: 'Restaurant Sushisen - Londres', categoryId: categoriesMap['Hotels & restaurants'], imageUrl: 'restaurant-sushisen-londres.png' },
            { title: 'La Balisière', categoryId: categoriesMap['Appartements'], imageUrl: 'la-balisiere.png' },
            { title: 'Structures Thermopolis', categoryId: categoriesMap['Objets'], imageUrl: 'structures-thermopolis.png' },
            { title: 'Appartement Paris X', categoryId: categoriesMap['Appartements'], imageUrl: 'appartement-paris-x.png' },
            { title: 'Le Coteau Cassis', categoryId: categoriesMap['Appartements'], imageUrl: 'le-coteau-cassis.png' },
            { title: 'Villa Ferneze', categoryId: categoriesMap['Appartements'], imageUrl: 'villa-ferneze.png' },
            { title: 'Appartement Paris XVIII', categoryId: categoriesMap['Appartements'], imageUrl: 'appartement-paris-xviii.png' },
            { title: 'Hotel First Arte - New Delhi', categoryId: categoriesMap['Hotels & restaurants'], imageUrl: 'hotel-first-arte-new-delhi.png' }
        ];

        await db.works.bulkCreate(projetsInitiaux);

        // Créer l'utilisateur admin par défaut
        const bcrypt = require('bcrypt');
        const defaultPassword = await bcrypt.hash('S0phie', 10);
        await db.users.create({
            email: 'sophie.bluel@test.tld',
            password: defaultPassword
        });

        res.status(200).json({ message: 'Base de données réinitialisée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation :', error);
        res.status(500).json({ error: 'Erreur lors de la réinitialisation de la base de données' });
    }
}; 