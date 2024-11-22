// ********************************************
// * Importations et initialisations *
// ********************************************

import { afficherVignettes } from "./gestionModale.js";
import { afficherProjets, mettreAJourProjets } from "./affichageProjets.js";

let projetASupprimer = null;

let projetsMAJ = mettreAJourProjets();

// ********************************************
// * Gestion Pop-Up *
// ********************************************
const afficherPopup = (projet) => {
  const popUp = document.querySelector(".pop-up");
  popUp.style.display = "flex";
  popUp.classList.add("pop-up-visible");

  const projetTitre = popUp.querySelector("h3");
  projetTitre.textContent = "";
  projetTitre.textContent = `Supprimer ${projet.title} ?`;

  const boutonAnnuler = document.querySelector(".pop-up__reponse-annuler");
  boutonAnnuler.addEventListener("click", (e) => {
    fermerPopup();
  });
};

const fermerPopup = () => {
  const popUp = document.querySelector(".pop-up");
  popUp.style.display = "none";

  const modale = document.querySelector(".modale");
  modale.removeEventListener("click", fermerPopup);

  document.querySelectorAll(".js-modale-stop").forEach((element) => {
    element.removeEventListener("click", fermerPopup);
  });

  popUp.classList.remove("pop-up-visible");
};

// ********************************************
// * Fonctions de suppression *
// ********************************************
const supprimerProjet = (projet, urlApiConnexion) => {
  const valideToken = sessionStorage.getItem("token");

  fetch(`http://localhost:5678/api/works/${projet.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${valideToken}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Projet supprimé avec succès !");
      } else {
        console.error(
          "Échec de la suppression :",
          response.status,
          response.statusText
        );
      }
    })
    .catch((error) => {
      console.error("Erreur réseau ou fetch :", error);
    });
};

const supprimerProjetLocalStorage = (projet) => {
  const projetsOld = JSON.parse(localStorage.getItem("projets"));

  const projetsMisAJour = projetsOld.filter(
    (projetOld) => projetOld.id !== projet.id
  );

  localStorage.setItem("projets", JSON.stringify(projetsMisAJour));

  console.log(`Projet avec l'id ${projet.id} supprimé.`);
};

// ********************************************
// * Fonction principale *
// ********************************************
export const routineSupressionProjet = (projet) => {
  projetASupprimer = projet;

  afficherPopup(projetASupprimer);

  const boutonConfirmation = document.querySelector(
    ".pop-up__reponse-supprimer"
  );

  if (boutonConfirmation && projetASupprimer) {
    boutonConfirmation.addEventListener(
      "click",
      function confirmerSuppression() {
        supprimerProjet(projetASupprimer);
        supprimerProjetLocalStorage(projetASupprimer);

        afficherVignettes();

        projetsMAJ = mettreAJourProjets();
        console.log(projetsMAJ);
        afficherProjets(projetsMAJ);

        fermerPopup();

        boutonConfirmation.removeEventListener("click", confirmerSuppression);
        projetASupprimer = null;
      }
    );
  }
};
