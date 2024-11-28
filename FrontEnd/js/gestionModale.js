// ********************************************
// * Importations et initialisations *
// ********************************************

import { routineSuppressionProjet } from "./suppressionProjet.js";
import {
  remplirMenuCategories,
  afficherAperçu,
  verifierChamps,
  gererChargementImage,
} from "./ajoutProjet.js";

// Référence à la modale active
let modaleActive = null;

// ********************************************
// * Fonctions de gestion de la modale *
// ********************************************

export const ouvrirGalerieModale = (e) => {
  e.preventDefault();
  modaleActive = document.getElementById("modale");

  // Affiche la modale et met à jour ses attributs d'accessibilité
  modaleActive.style.display = "flex";
  modaleActive.removeAttribute("aria-hidden");
  modaleActive.setAttribute("aria-modal", "true");

  afficherProjetsModale(); // Met à jour la galerie dans la modale

  // Masque les pop-ups et réinitialise leurs états
  const popUp = document.querySelector(".pop-up");
  popUp.style.display = "none";
  popUp.classList.remove("pop-up-visible");

  // Ajoute un écouteur pour fermer la modale lorsqu'on clique à l'extérieur
  modaleActive.addEventListener("click", (e) => {
    if (e.target === modaleActive) {
      fermerModale();
    }
  });

  activerEcouteursModale(); // Active les écouteurs pour la modale
};

const ouvrirModaleAjouterPhoto = () => {
  // Masque la galerie et affiche la modale d'ajout de photo
  const galerieModale = document.querySelector(".modale-galerie");
  galerieModale.style.display = "none";

  const modaleAjouterPhoto = document.querySelector(".modale-ajout-photo");
  modaleAjouterPhoto.style.display = "flex";

  // Prépare le formulaire et son aperçu
  remplirMenuCategories();
  afficherAperçu();
  verifierChamps();
};

const fermerModale = () => {
  if (modaleActive === null) return;

  // Met à jour les attributs d'accessibilité de la modale
  modaleActive.removeAttribute("aria-modal");
  modaleActive.setAttribute("aria-hidden", "true");

  // Ferme la modale après un délai
  window.setTimeout(() => {
    if (modaleActive) {
      modaleActive.style.display = "none";
      modaleActive = null;
    }
  }, 200);

  // Réinitialise la modale et ses composants
  fermerModaleAjouterPhoto();
  const popUp = document.querySelector(".pop-up");
  popUp.style.display = "none";
  popUp.classList.remove("pop-up-visible");
  reinitialiserFormulaireAjout();

  // Retire tous les écouteurs de la modale
  modaleActive.removeEventListener("click", fermerModale);
  modaleActive.querySelectorAll(".js-modale-close").forEach((btn) => {
    btn.removeEventListener("click", fermerModale);
  });

  modaleActive.querySelectorAll(".js-modale-stop").forEach((element) => {
    element.removeEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
};

const activerEcouteursModale = () => {
  // Ajoute les écouteurs pour fermer la modale
  const boutonsFermer = modaleActive.querySelectorAll(".js-modale-close");
  boutonsFermer.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      fermerModale();
    });
  });

  // Ajoute un écouteur au bouton pour ouvrir la modale d'ajout de photo
  const boutonAjouterPhoto = modaleActive.querySelector(".bouton-ajout-photo");
  boutonAjouterPhoto.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    ouvrirModaleAjouterPhoto();
  });

  // Empêche la propagation des clics sur certains éléments
  const stopClick = modaleActive.querySelectorAll(".js-modale-stop");
  stopClick.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
};

export const afficherProjetsModale = () => {
  const projets = JSON.parse(localStorage.getItem("projets"));
  const galerieModale = document.querySelector(".modale .galerie-modale");
  galerieModale.innerHTML = ""; // Réinitialise le contenu de la galerie

  // Crée des vignettes pour chaque projet
  projets.forEach((projet) => {
    const conteneurImage = document.createElement("div");
    conteneurImage.classList.add("projet-container");

    const projetImage = document.createElement("img");
    projetImage.src = projet.imageUrl; // Définit l'image du projet
    projetImage.alt = projet.title; // Ajoute un texte alternatif
    conteneurImage.appendChild(projetImage);

    // Ajoute une icône de suppression au projet
    const iconeSupprimer = document.createElement("i");
    iconeSupprimer.classList.add("fa-solid", "fa-trash-can");
    conteneurImage.appendChild(iconeSupprimer);

    galerieModale.appendChild(conteneurImage);

    // Ajoute un écouteur pour gérer la suppression du projet
    iconeSupprimer.addEventListener("click", (e) => {
      e.stopPropagation();
      routineSuppressionProjet(projet);
    });
  });
};

export const fermerModaleAjouterPhoto = () => {
  const galerieModale = document.querySelector(".modale-galerie");
  const modaleAjouterPhoto = document.querySelector(".modale-ajout-photo");

  // Réinitialise l'état des modales
  modaleAjouterPhoto.style.display = "none";
  galerieModale.style.animation = "none";
  galerieModale.style.display = "flex";

  reinitialiserFormulaireAjout(); // Réinitialise le formulaire
};

// ********************************************
// * Gestion des événements *
// ********************************************

const boutonRetour = document.querySelector(".js-modale-back");
if (boutonRetour) {
  boutonRetour.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Réinitialise le formulaire et retourne à la galerie
    reinitialiserFormulaireAjout();
    fermerModaleAjouterPhoto();
  });
}

const reinitialiserFormulaireAjout = () => {
  // Réinitialise les champs du formulaire d'ajout de projet
  const inputImage = document.getElementById("photo");
  const titreProjet = document.getElementById("titre");
  const categorieProjet = document.getElementById("categorie");

  inputImage.value = "";
  titreProjet.value = "";
  categorieProjet.value = "";

  // Réinitialise l'aperçu de l'image
  const conteneurApercu = document.querySelector(".conteneur-apercu");
  conteneurApercu.innerHTML = "";
  conteneurApercu.style.display = "none";

  // Réaffiche le texte d'indication
  const messageAjoutPhoto = document.querySelector(".ajout-photo");
  messageAjoutPhoto.style.display = "flex";

  inputImage.removeEventListener("change", gererChargementImage); // Supprime l'écouteur
};
