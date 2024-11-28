// ********************************************
// * Importations et initialisations *
// ********************************************

import { afficherProjetsModale } from "./gestionModale.js";
import { afficherProjets, chargerProjets } from "./affichageProjets.js";

// Référence au projet actuellement en cours de suppression
let projetASupprimer = null;

// ********************************************
// * Gestion Pop-Up (pour confirmation de suppression) *
// ********************************************

// Note : Ce code gère l'affichage d'une pop-up pour demander la confirmation
// avant la suppression d'un projet. Désactivé actuellement mais prêt à être réactivé.
//
// const afficherPopup = (projet) => {
//   const popUp = document.querySelector(".pop-up");
//   popUp.style.display = "flex"; // Affiche la pop-up
//   popUp.classList.add("pop-up-visible");

//   const projetTitre = popUp.querySelector("h3"); // Met à jour le titre dans la pop-up
//   projetTitre.textContent = "";
//   projetTitre.textContent = `Supprimer ${projet.title} ?`;

//   const boutonAnnuler = document.querySelector(".pop-up__reponse-annuler");
//   boutonAnnuler.addEventListener("click", (e) => {
//     fermerPopup(); // Annule la suppression et ferme la pop-up
//   });
// };

// const fermerPopup = () => {
//   const popUp = document.querySelector(".pop-up");
//   popUp.style.display = "none"; // Masque la pop-up

//   const modale = document.querySelector(".modale");
//   modale.removeEventListener("click", fermerPopup); // Retire les écouteurs liés à la pop-up

//   document.querySelectorAll(".js-modale-stop").forEach((element) => {
//     element.removeEventListener("click", fermerPopup);
//   });

//   popUp.classList.remove("pop-up-visible"); // Réinitialise l'état de la pop-up
// };

// ********************************************
// * Fonctions de suppression *
// ********************************************

const supprimerProjet = (projet, urlApiConnexion) => {
  // Récupère le token pour l'authentification
  const valideToken = sessionStorage.getItem("token");

  // Effectue une requête DELETE pour supprimer le projet côté serveur
  fetch(`http://localhost:5678/api/works/${projet.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${valideToken}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Projet supprimé avec succès !"); // Confirmation de suppression côté serveur
      } else {
        console.error(
          "Échec de la suppression :",
          response.status,
          response.statusText
        );
      }
    })
    .catch((error) => {
      // Gestion des erreurs réseau ou de la requête
      console.error("Erreur réseau ou fetch :", error);
    });
};

const supprimerProjetDuLocalStorage = (projet) => {
  // Récupère la liste des projets dans le localStorage
  const projetsOld = JSON.parse(localStorage.getItem("projets"));

  // Filtre les projets pour exclure celui qui doit être supprimé
  const projetsMisAJour = projetsOld.filter(
    (projetOld) => projetOld.id !== projet.id
  );

  // Met à jour la liste des projets dans le localStorage
  localStorage.setItem("projets", JSON.stringify(projetsMisAJour));

  console.log(`Projet avec l'id ${projet.id} supprimé du localStorage.`);
};

// ********************************************
// * Fonction principale *
// ********************************************

export const routineSuppressionProjet = (projet) => {
  // Stocke temporairement le projet à supprimer
  projetASupprimer = projet;

  // Note : Le code de la pop-up peut être activé pour confirmer la suppression
  // afficherPopup(projetASupprimer);
  //
  // const boutonConfirmation = document.querySelector(
  //   ".pop-up__reponse-supprimer"
  // );
  //
  // if (boutonConfirmation && projetASupprimer) {
  //   boutonConfirmation.addEventListener(
  //     "click",
  //     function confirmerSuppression() {

  // Supprime le projet côté serveur
  supprimerProjet(projetASupprimer);

  // Supprime le projet du localStorage
  supprimerProjetDuLocalStorage(projetASupprimer);

  const mettreAJourProjets = async () => {
    try {
      // Recharge la liste des projets et met à jour l'affichage
      const projets = await chargerProjets();
      afficherProjets(projets);
      afficherProjetsModale(); // Met à jour l'affichage dans la modale
    } catch (error) {
      // Gestion des erreurs lors de la récupération des projets
      console.error("Erreur lors de la récupération des projets :", error);
    }
  };

  mettreAJourProjets(); // Actualise les projets après suppression

  // Réinitialise la variable après la suppression
  projetASupprimer = null;

  // Note : Fermer la pop-up si elle est utilisée
  // fermerPopup();
  // boutonConfirmation.removeEventListener("click", confirmerSuppression);
  //   }
  // );
  // }
};
