// ********************************************
// * Configuration de l'affichage des projets *
// ********************************************

export const afficherProjets = (projetsSelectionnes) => {
  const galerie = document.querySelector(".galerie-portfolio");

  // Vérifie que la galerie et les projets sélectionnés existent, sinon arrête la fonction
  if (!galerie || !projetsSelectionnes || projetsSelectionnes.length === 0)
    return;

  // Vide la galerie avant d'y ajouter les nouveaux projets
  galerie.innerHTML = "";

  // Parcourt les projets sélectionnés pour créer et afficher leurs éléments dans le DOM
  projetsSelectionnes.forEach((projet, index) => {
    const figure = document.createElement("figure");
    const projetImage = document.createElement("img");
    const projetNom = document.createElement("figcaption");

    // Ajoute une classe spécifique à chaque figure pour les animations
    figure.setAttribute("class", `apparition apparition--${index + 1}`);
    projetImage.src = projet.imageUrl; // Définit l'URL de l'image du projet
    projetImage.alt = projet.title; // Ajoute une description accessible pour l'image
    projetNom.innerText = projet.title; // Définit le titre du projet

    // Ajoute les éléments créés à la galerie
    galerie.appendChild(figure);
    figure.appendChild(projetImage);
    figure.appendChild(projetNom);
  });
};

// ********************************************
// * Création des boutons de filtrage *
// ********************************************

const filtresDiv = document.querySelector(".boutons-filtre");

// Crée un bouton pour une catégorie spécifique
const creerBoutonFiltre = (categorie) => {
  const categorieBouton = document.createElement("button");
  categorieBouton.textContent = categorie;

  // Ajoute une description accessible pour chaque bouton
  categorieBouton.setAttribute(
    "aria-label",
    categorie === "Tous"
      ? "Afficher tous les projets"
      : `Filtrer les projets pour afficher les projets de la catégorie ${categorie}`
  );

  if (filtresDiv) {
    // Ajoute le bouton à la section des filtres
    filtresDiv.appendChild(categorieBouton);

    // Ajoute un gestionnaire d'événement pour filtrer les projets au clic
    categorieBouton.addEventListener("click", () => {
      const projetsFiltres =
        categorie === "Tous"
          ? listeProjets // Affiche tous les projets si "Tous" est sélectionné
          : listeProjets.filter(
              (element) => element.category.name === categorie
            ); // Filtre par catégorie

      afficherProjets(projetsFiltres); // Met à jour l'affichage des projets

      console.log(
        `Catégorie sélectionnée : ${categorie}. Nombre de projets : ${projetsFiltres.length}`
      );
    });
  }
};

// Génère les boutons de filtre pour chaque catégorie unique
const genererBoutonsFiltres = () => {
  const categoriesUniques = new Set();

  if (listeProjets) {
    // Identifie les catégories uniques à partir de la liste des projets
    listeProjets.forEach((projet) => {
      categoriesUniques.add(projet.category.name);
    });

    creerBoutonFiltre("Tous"); // Ajoute le bouton pour afficher tous les projets

    // Ajoute un bouton pour chaque catégorie unique
    for (let eachCategorie of categoriesUniques) {
      creerBoutonFiltre(eachCategorie);
    }
  }
};

// ********************************************
// * Récupération des projets et Initialisation de l'affichage
// ********************************************

export const chargerProjets = () => {
  const urlApiProjets = "http://localhost:5678/api/works";

  // Vérifie si les projets sont déjà enregistrés dans le localStorage
  const projetsFromLocalStorage = localStorage.getItem("projets");

  if (projetsFromLocalStorage) {
    // Si les projets existent dans le localStorage, les retourne sous forme d'objet
    return JSON.parse(projetsFromLocalStorage);
  }

  // Sinon, récupère les projets depuis l'API
  return fetch(urlApiProjets)
    .then((reponse) => reponse.json())
    .then((data) => {
      // Stocke les projets dans le localStorage pour une utilisation future
      localStorage.setItem("projets", JSON.stringify(data));
      return data;
    })
    .catch((error) => {
      // Gère les erreurs réseau ou de récupération
      console.error("Erreur :", error);
      showErrorMessage(
        error.message || "Erreur réseau. Veuillez réessayer plus tard."
      );
      return [];
    });
};

// Initialise l'application : charge les projets et affiche la galerie
const initProjets = async () => {
  const listeProjets = await chargerProjets(); // Récupère la liste des projets
  afficherProjets(listeProjets); // Affiche les projets dans la galerie
};
initProjets();
