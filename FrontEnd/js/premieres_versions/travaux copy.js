// travaux.js

// === Récupération des travaux ===

// Récupération des travaux dans le LocalStorage pour éviter un appel API si possible
let travaux = window.localStorage.getItem("travaux");

// Si aucun travail n'est stocké, appelle l'API pour récupérer les travaux
if (travaux === null) {
  const response = await fetch("http://localhost:5678/api/works");
  travaux = await response.json();
  // Stockage des travaux dans le LocalStorage pour les accès futurs
  window.localStorage.setItem("travaux", JSON.stringify(travaux));
} else {
  // Conversion des données stockées en JSON si elles existent déjà dans le LocalStorage
  travaux = JSON.parse(travaux);
}

console.log("Liste des travaux chargés :", travaux); // Affiche les travaux pour vérifier leur récupération
export { travaux };

// === Affichage de la galerie ===

/**
 * Affiche une liste de travaux dans l'élément HTML de la galerie.
 * @param {Array} travaux - Liste des travaux à afficher, chaque travail étant un objet avec des propriétés comme `id`, `title`, et `imageUrl`.
 */
export function afficherTravaux(travaux) {
  // Récupère l'élément HTML de la galerie dans le DOM
  const galerie = document.querySelector(".galerie");
  galerie.innerHTML = ""; // Vide le contenu actuel de la galerie

  // Boucle à travers chaque travail pour l'afficher
  for (let i = 0; i < travaux.length; i++) {
    const travail = travaux[i];

    // Création d'une balise <figure> pour représenter le travail
    const travauxElement = document.createElement("figure");
    travauxElement.dataset.id = travail.id; // Ajoute un attribut data-id pour identifier le travail
    travauxElement.setAttribute("class", `apparition apparition--${i + 1}`); // Ajoute une classe pour les animations

    // Création de l'image du travail
    const imageElement = document.createElement("img");
    imageElement.src = travail.imageUrl; // Définit la source de l'image
    imageElement.alt = travail.title; // Définit le texte alternatif de l'image pour l'accessibilité

    // Création du titre du travail sous forme de légende
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = travail.title;

    // Ajoute l'élément figure avec ses enfants (image et titre) dans la galerie
    galerie.appendChild(travauxElement);
    travauxElement.appendChild(imageElement);
    travauxElement.appendChild(titleElement);
  }
}

// === Gestion des boutons de filtrage par catégorie ===

// Création d'un Set pour stocker les catégories uniques des travaux
const ensembleCategories = new Set();
for (let i = 0; i < travaux.length; i++) {
  ensembleCategories.add(travaux[i].category.name); // Ajoute chaque catégorie unique dans le Set
}

console.log("Catégories uniques extraites :", ensembleCategories); // Affiche les catégories uniques pour vérification

/**
 * Génère les boutons de filtrage pour chaque catégorie dans le Set.
 */
export function genererBoutonsFiltres() {
  // Crée un bouton pour afficher tous les travaux sans filtrage
  creerBoutonFiltre("Tous");

  // Crée un bouton pour chaque catégorie unique
  for (let categorie of ensembleCategories) {
    creerBoutonFiltre(categorie);
  }
}

/**
 * Crée un bouton de filtrage pour une catégorie spécifique et gère son événement de clic.
 * @param {string} categorie - Le nom de la catégorie pour laquelle le bouton est créé.
 */
function creerBoutonFiltre(categorie) {
  const conteneur = document.querySelector(".boutons-filtre"); // Sélectionne le conteneur pour les boutons de filtrage
  const bouton = document.createElement("button");
  bouton.textContent = categorie; // Définit le texte du bouton comme le nom de la catégorie

  // Définit un attribut aria-label pour l'accessibilité, pour expliquer la fonction du bouton
  if (categorie === "Tous") {
    bouton.setAttribute("aria-label", "Afficher tous les travaux");
  } else {
    bouton.setAttribute(
      "aria-label",
      `Filtrer les travaux pour afficher les travaux de la catégorie ${categorie}`
    );
  }
  // Ajoute le bouton dans le conteneur
  conteneur.appendChild(bouton);

  // Ajoute un écouteur d'événement au bouton pour filtrer les travaux au clic
  bouton.addEventListener("click", () => {
    console.log("Vous avez cliqué sur le bouton : " + categorie);

    // Filtre les travaux en fonction de la catégorie sélectionnée
    const filtredtravaux = travaux.filter(function (travauxElement) {
      // Si le bouton "Tous" est cliqué, retourne tous les travaux
      if (categorie === "Tous") {
        return true;
      } else {
        // Sinon, retourne seulement les travaux correspondant à la catégorie
        return travauxElement.categorie.name === categorie;
      }
    });

    // Met à jour la galerie avec les travaux filtrés
    document.querySelector(".galerie").innerHTML = "";
    afficherTravaux(filtredtravaux);
  });
}
