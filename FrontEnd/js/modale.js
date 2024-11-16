// ********************************************
// * Importations et initialisations *
// ********************************************

import { afficherVignettes } from "./projets.js";
// import { apiServices } from "./apiServices.js";

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

  if (modale) {
    afficherVignettes();
  }
  activerEcouteursModale();

  // Fermer la modale en cliquant en dehors du contenu (je ne sais pas trop comment)
  modale.addEventListener("click", fermerModale);
};

const ouvrirModaleAjout = () => {
  const modaleAjout = document.querySelector(".modale-galerie");
  modaleAjout.style.display = "none";

  document.querySelector(".modale-ajout-photo").style.display = "flex";

  // apiServices();
};

const fermerModale = (e) => {
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

  // Retirer les écouteurs (je sais pas trop pourquoi)
  modale.removeEventListener("click", fermerModale);
  modale
    .querySelector(".js-modale-close")
    .removeEventListener("click", fermerModale);

  const stopElements = modale.querySelectorAll(".js-modale-stop");
  stopElements.forEach((el) => {
    el.removeEventListener("click", stopPropagation);
  });
};

const stopPropagation = (e) => {
  e.stopPropagation();
};

const activerEcouteursModale = () => {
  const boutonFermer = modale.querySelectorAll(".js-modale-close");
  boutonFermer.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      fermerModale();
    });
  });

  const boutonAjoutPhoto = modale.querySelector(".ajout-photo");
  boutonAjoutPhoto.addEventListener("click", (e) => {
    e.stopPropagation();
    ouvrirModaleAjout();
  });

  // Empêcher la propagation du clic (comprends toujours pas bien)
  const stopClick = modale.querySelectorAll(".js-modale-stop");
  stopClick.forEach((element) => {
    element.addEventListener("click", stopPropagation);
  });
};

// ********************************************
// * Gestion des événements *
// ********************************************

const boutonRetour = document.querySelector(".js-modale-back");
if (boutonRetour) {
  boutonRetour.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Afficher la galerie et masquer la section d'ajout
    const galerie = document.querySelector(".modale-galerie");
    const ajoutPhoto = document.querySelector(".modale-ajout-photo");
    ajoutPhoto.style.display = "none";
    galerie.style.animation = "none";
    galerie.style.display = "flex";
  });
}
