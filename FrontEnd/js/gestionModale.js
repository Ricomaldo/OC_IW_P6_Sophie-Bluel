// ********************************************
// * Importations et initialisations *
// ********************************************

import { routineSupressionProjet } from "./suppressionProjet.js";
import { remplirSelectionCategories, afficherAperçu } from "./ajoutProjet.js";

let modale = null;

// ********************************************
// * Fonctions de gestion de la modale *
// ********************************************

export const ouvrirModaleGalerie = (e) => {
  e.preventDefault();
  modale = document.getElementById("modale");

  modale.style.display = "flex";
  modale.removeAttribute("aria-hidden");
  modale.setAttribute("aria-modal", "true");

  afficherVignettes();
  const popUp = document.querySelector(".pop-up");
  popUp.style.display = "none";
  popUp.classList.remove("pop-up-visible");

  modale.addEventListener("click", (e) => {
    if (e.target === modale) {
      fermerModale();
    }
  });

  activerEcouteursModale();
};

const ouvrirModaleAjout = () => {
  const modaleGalerie = document.querySelector(".modale-galerie");
  modaleGalerie.style.display = "none";
  const modaleAjout = document.querySelector(".modale-ajout-photo");

  modaleAjout.style.display = "flex";
  remplirSelectionCategories();
  afficherAperçu();
};

const fermerModale = () => {
  if (modale === null) return;

  modale.removeAttribute("aria-modal");
  modale.setAttribute("aria-hidden", "true");

  // Ferme la modale avec un délai
  window.setTimeout(() => {
    if (modale) {
      modale.style.display = "none";
      modale = null;
    }
  }, 200);

  //reinitialiser la modale
  fermerModaleAjout();
  //supprimer popup
  const popUp = document.querySelector(".pop-up");
  popUp.style.display = "none";
  popUp.classList.remove("pop-up-visible");

  //supprimer l'aperçu
  const apercuPhoto = document.querySelector(".apercu-image");
  const texteAjoutPhoto = document.querySelector(".ajout-photo");
  if (apercuPhoto) {
    texteAjoutPhoto.style.display = "flex";
    apercuPhoto.remove();
  }

  // Retirer les écouteurs
  modale.removeEventListener("click", fermerModale);

  modale.querySelectorAll(".js-modale-close").forEach((btn) => {
    btn.removeEventListener("click", fermerModale);
  });

  modale.querySelectorAll(".js-modale-stop").forEach((element) => {
    element.removeEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
};

const activerEcouteursModale = () => {
  const boutonFermer = modale.querySelectorAll(".js-modale-close");
  boutonFermer.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      fermerModale();
    });
  });

  const boutonAjoutPhoto = modale.querySelector(".bouton-ajout-photo");
  boutonAjoutPhoto.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    ouvrirModaleAjout();
  });

  const stopClick = modale.querySelectorAll(".js-modale-stop");
  stopClick.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });
};

export const afficherVignettes = () => {
  const projets = JSON.parse(localStorage.getItem("projets"));
  const galerie = document.querySelector(".modale .galerie");
  galerie.innerHTML = "";

  projets.forEach((projet) => {
    const imageConteneur = document.createElement("div");
    imageConteneur.classList.add("projet-container");

    const projetImage = document.createElement("img");

    projetImage.src = projet.imageUrl;
    projetImage.alt = projet.title;
    imageConteneur.appendChild(projetImage);

    const poubelleIcone = document.createElement("i");
    poubelleIcone.classList.add("fa-solid", "fa-trash-can");
    imageConteneur.appendChild(poubelleIcone);

    galerie.appendChild(imageConteneur);
    poubelleIcone.addEventListener("click", (e) => {
      e.stopPropagation();
      routineSupressionProjet(projet);
    });
  });
};

export const fermerModaleAjout = () => {
  // Afficher la galerie et masquer la section d'ajout
  const galerie = document.querySelector(".modale-galerie");
  const ajoutPhoto = document.querySelector(".modale-ajout-photo");
  ajoutPhoto.style.display = "none";
  galerie.style.animation = "none";
  galerie.style.display = "flex";

  //supprimer l'aperçu
  const apercuPhoto = document.querySelector(".apercu-image");
  const texteAjoutPhoto = document.querySelector(".ajout-photo");
  if (apercuPhoto) {
    texteAjoutPhoto.style.display = "flex";
    apercuPhoto.remove();
  }
};

// ********************************************
// * Gestion des événements *
// ********************************************

const boutonRetour = document.querySelector(".js-modale-back");
if (boutonRetour) {
  boutonRetour.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    fermerModaleAjout();
  });
}
