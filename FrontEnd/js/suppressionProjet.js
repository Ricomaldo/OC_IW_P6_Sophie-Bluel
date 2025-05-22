// ********************************************
// * Importations et initialisations *
// ********************************************

import { afficherProjetsModale } from "./gestionModale.js";
import { afficherProjets, chargerProjets } from "./affichageProjets.js";
import config from "./config.js";

// Référence au projet actuellement en cours de suppression
let projetASupprimer = null;

// ********************************************
// * Gestion Pop-Up (pour confirmation de suppression) *
// ********************************************

const afficherPopup = (projet) => {
  const popUp = document.querySelector(".pop-up");
  if (!popUp) return;

  // Affiche la pop-up
  popUp.style.display = "flex";
  popUp.classList.add("pop-up-visible");

  // Met à jour le titre dans la pop-up
  const projetTitre = popUp.querySelector("h3");
  if (projetTitre) {
    projetTitre.textContent = `Supprimer ${projet.title} ?`;
  }

  // Gestion du bouton Annuler
  const boutonAnnuler = popUp.querySelector(".pop-up__reponse-annuler");
  if (boutonAnnuler) {
    const annulerHandler = () => {
      fermerPopup();
      boutonAnnuler.removeEventListener("click", annulerHandler);
    };
    boutonAnnuler.addEventListener("click", annulerHandler);
  }

  // Gestion du bouton Confirmer
  const boutonConfirmer = popUp.querySelector(".pop-up__reponse-supprimer");
  if (boutonConfirmer) {
    const confirmerHandler = async () => {
      await supprimerProjet(projet);
      supprimerProjetDuLocalStorage(projet);
      await mettreAJourProjets();
      fermerPopup();
      boutonConfirmer.removeEventListener("click", confirmerHandler);
    };
    boutonConfirmer.addEventListener("click", confirmerHandler);
  }

  // Fermeture au clic en dehors
  const clickOutsideHandler = (e) => {
    if (e.target === popUp) {
      fermerPopup();
      popUp.removeEventListener("click", clickOutsideHandler);
    }
  };
  popUp.addEventListener("click", clickOutsideHandler);
};

const fermerPopup = () => {
  const popUp = document.querySelector(".pop-up");
  if (!popUp) return;

  // Masque la pop-up
  popUp.style.display = "none";
  popUp.classList.remove("pop-up-visible");

  // Retire tous les écouteurs d'événements
  const modale = document.querySelector(".modale");
  if (modale) {
    modale.removeEventListener("click", fermerPopup);
  }

  document.querySelectorAll(".js-modale-stop").forEach((element) => {
    element.removeEventListener("click", fermerPopup);
  });
};

// ********************************************
// * Fonctions de suppression *
// ********************************************

const supprimerProjet = async (projet) => {
  try {
    const valideToken = sessionStorage.getItem("token");
    if (!valideToken) {
      throw new Error("Token d'authentification non trouvé");
    }

    const response = await fetch(`${config.apiUrl}/works/${projet.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${valideToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Échec de la suppression : ${response.status} ${response.statusText}`);
    }

    console.log("Projet supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    throw error;
  }
};

const supprimerProjetDuLocalStorage = (projet) => {
  try {
    const projetsOld = JSON.parse(localStorage.getItem("projets") || "[]");
    const projetsMisAJour = projetsOld.filter(projetOld => projetOld.id !== projet.id);
    localStorage.setItem("projets", JSON.stringify(projetsMisAJour));
  } catch (error) {
    console.error("Erreur lors de la mise à jour du localStorage :", error);
  }
};

const mettreAJourProjets = async () => {
  try {
    const projets = await chargerProjets();
    afficherProjets(projets);
    afficherProjetsModale();
  } catch (error) {
    console.error("Erreur lors de la mise à jour des projets :", error);
    throw error;
  }
};

// ********************************************
// * Fonction principale *
// ********************************************

export const routineSuppressionProjet = (projet) => {
  if (!projet) {
    console.error("Aucun projet fourni pour la suppression");
    return;
  }

  projetASupprimer = projet;
  afficherPopup(projetASupprimer);
};
