// ********************************************
// * Importations et initialisations *
// ********************************************

import { afficherVignettes, fermerModaleAjout } from "./gestionModale.js";
import { afficherProjets, mettreAJourProjets } from "./affichageProjets.js";
let projetsMAJ = mettreAJourProjets();

// ********************************************
// * Fonction d'affichage *
// ********************************************
export const remplirSelectionCategories = () => {
  fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Assure-toi d'ajouter un token si nécessaire
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories.");
      }
      return response.json();
    })
    .then((categories) => {
      const selectCategorie = document.getElementById("categorie");

      selectCategorie.innerHTML = "";

      categories.forEach((categorie) => {
        const option = document.createElement("option");
        option.value = categorie.id; // Assure-toi que c'est le bon identifiant dans l'API
        option.textContent = categorie.name; // Utilise le bon attribut pour le nom de la catégorie
        selectCategorie.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erreur de récupération des catégories : ", error);
    });
};

export const afficherAperçu = () => {
  const conteneurAjoutPhoto = document.querySelector(".conteneur-ajout-photo");
  const photoInput = document.getElementById("photo");

  photoInput.addEventListener("change", (e) => {
    const dataPhoto = e.target.files[0];
    const typesAcceptes = ["image/png", "image/jpeg"];

    if (!dataPhoto) {
      alert("Aucun fichier sélectionné.");
      return;
    }

    if (dataPhoto.size > 4000000) {
      alert(
        "Le fichier est trop volumineux. Veuillez sélectionner un fichier inférieur à 4 Mo."
      );
      e.target.value = ""; // Réinitialiser l'input
      return;
    }

    if (!typesAcceptes.includes(dataPhoto.type)) {
      alert("Format invalide. Veuillez sélectionner une image PNG ou JPG.");
      e.target.value = ""; // Réinitialiser l'input
      return;
    }

    console.log("Fichier accepté :", dataPhoto.name, dataPhoto.size, "octets");

    const texteAjoutPhoto = document.querySelector(".ajout-photo");
    texteAjoutPhoto.style.display = "none";

    const reader = new FileReader();

    reader.onload = (event) => {
      const apercuImage = document.createElement("img");
      apercuImage.classList.add("apercu-image");
      apercuImage.src = event.target.result;

      conteneurAjoutPhoto.appendChild(apercuImage);
    };

    reader.readAsDataURL(dataPhoto);
  });
};
// ********************************************
// * Fonctions d'ajout de projet *
// ********************************************
const formulaireAjout = document.querySelector(".modale-ajout-photo form");

const inputImage = document.getElementById("photo");
const titreProjet = document.getElementById("titre");
const categorieProjet = document.getElementById("categorie");
if (formulaireAjout) {
  formulaireAjout.addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageProjet = inputImage.files[0];
    if (!imageProjet) {
      alert("y a pas de photo, recommence :)");
      return;
    }
    const verification = verifierChamps(titreProjet, categorieProjet);

    if (!verification.valide) {
      alert(verification.erreur);
      return;
    }
    // Debug pour vérifier FormData
    const formData = new FormData();
    formData.append("image", imageProjet);
    formData.append("title", titreProjet.value);
    formData.append("category", categorieProjet.value);

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Envoi des données
    await ajouterNouveauProjet(formData);
  });
}
const verifierChamps = (titre, categorie) => {
  if (!titre.value || !categorie.value) {
    return { valide: false, erreur: "champsVides" };
  }

  return { valide: true };
};

const ajouterNouveauProjet = async (formData) => {
  const valideToken = sessionStorage.getItem("token");

  try {
    // Requête API
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${valideToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'envoi de l'image.");
    }

    const nouveauProjet = await response.json();
    console.log("Projet envoyée avec succès :", nouveauProjet);

    titreProjet.value = "";
    categorieProjet.value = "";
    inputImage.value = "";
    fermerModaleAjout();
    // Mettre à jour le cache local
    let projets = JSON.parse(localStorage.getItem("projets")) || [];
    projets.push(nouveauProjet); // Ajouter le nouveau projet
    localStorage.setItem("projets", JSON.stringify(projets));

    // Réafficher les projets avec le nouveau projet inclus
    afficherProjets(projets);
    genererBoutonsFiltres(projets);
    afficherVignettes();
    alert("Projet ajouté avec succès !");
  } catch (error) {
    console.error("Erreur API :", error);
  }
};
