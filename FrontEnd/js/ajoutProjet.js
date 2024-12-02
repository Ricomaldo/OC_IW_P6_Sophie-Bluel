// ********************************************
// * 1. Importations et constantes globales *
// ********************************************

import { afficherProjets, chargerProjets } from "./affichageProjets.js";
import { redimensionnerImage } from "./redimensionnement.js";

// Sélection des éléments principaux du DOM
const formulaireAjout = document.querySelector(".modale-ajout-photo form");
const inputImage = document.getElementById("photo");
const titreProjet = document.getElementById("titre");
const categorieProjet = document.getElementById("categorie");

// ********************************************
// * 2. Fonctions utilitaires *
// ********************************************

// Récupère et remplit le menu déroulant des catégories
let correspondancesCategories = new Map(); // Déclare cette variable globale

export const remplirMenuCategories = () => {
  fetch("http://localhost:5678/api/categories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Authentification
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
      selectCategorie.innerHTML = ""; // Vide les options actuelles

      // Ajoute les catégories au menu déroulant et les enregistre dans le mapping
      categories.forEach((categorie) => {
        const option = document.createElement("option");
        option.value = categorie.id;
        option.textContent = categorie.name;
        selectCategorie.appendChild(option);
        correspondancesCategories.set(categorie.id, categorie.name); // Stocke dans le mapping
      });

      // Ajoute une option vide par défaut
      const optionVide = document.createElement("option");
      optionVide.value = "";
      optionVide.disabled = true;
      optionVide.selected = true;
      selectCategorie.insertBefore(optionVide, selectCategorie.firstChild);
    })
    .catch((error) => {
      console.error("Erreur de récupération des catégories : ", error);
    });
};

// Gère l'aperçu de l'image sélectionnée
export const gererChargementImage = (e) => {
  const dataPhoto = e.target.files[0];
  const typesAcceptes = ["image/png", "image/jpeg"];

  if (!dataPhoto) {
    alert("Aucun fichier sélectionné.");
    return;
  }

  // Vérifie la taille et le format de l'image
  if (dataPhoto.size > 4000000) {
    alert(
      "Le fichier est trop volumineux. Veuillez sélectionner un fichier inférieur à 4 Mo."
    );
    e.target.value = "";
    return;
  }

  if (!typesAcceptes.includes(dataPhoto.type)) {
    alert("Format invalide. Veuillez sélectionner une image PNG ou JPG.");
    e.target.value = "";
    return;
  }

  console.log("Fichier accepté :", dataPhoto.name, dataPhoto.size, "octets");

  // Met à jour l'aperçu de l'image
  const messageAjoutPhoto = document.querySelector(".ajout-photo");
  messageAjoutPhoto.style.display = "none";
  const conteneurPrevisualisation = document.querySelector(".conteneur-apercu");
  conteneurPrevisualisation.style.display = "flex";

  const reader = new FileReader();

  reader.onload = (event) => {
    const apercuImage = document.createElement("img");
    apercuImage.classList.add("apercu-image");
    apercuImage.src = event.target.result;
    conteneurPrevisualisation.appendChild(apercuImage);
    verifierChamps(); // Réévalue les champs
  };

  reader.readAsDataURL(dataPhoto);
};

// Vérifie si tous les champs nécessaires sont remplis
export const verifierChamps = () => {
  const boutonValider = document.querySelector(".bouton-valider-photo");
  if (!titreProjet.value || !categorieProjet.value || !inputImage.files[0]) {
    boutonValider.disabled = true; // Désactive le bouton si des champs sont vides
    return { valide: false, erreur: "champsVides" };
  } else {
    boutonValider.disabled = false; // Active le bouton si tous les champs sont remplis
  }

  return { valide: true }; // Retourne un statut valide si tout est correct
};

// Ajoute un nouveau projet via une requête API
const ajouterProjet = async (formData) => {
  const valideToken = sessionStorage.getItem("token");

  try {
    // Envoie une requête POST pour ajouter le projet
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

    // Ajoute le nom de la catégorie à partir du mapping
    const nomCategorie = correspondancesCategories.get(
      parseInt(nouveauProjet.categoryId, 10)
    );
    nouveauProjet.category = {
      id: nouveauProjet.categoryId,
      name: nomCategorie || "Inconnue", // Valeur par défaut si le nom est introuvable
    };

    console.log("Projet ajouté avec succès :", nouveauProjet);

    // Met à jour les projets dans le localStorage
    let projets = JSON.parse(localStorage.getItem("projets")) || [];
    projets.push(nouveauProjet);
    localStorage.setItem("projets", JSON.stringify(projets));

    afficherProjets(projets); // Rafraîchit l'affichage des projets
    window.location.href = "index.html"; // Recharge la page si nécessaire
  } catch (error) {
    console.error("Erreur API :", error);
  }
};

// ********************************************
// * 3. Logique principale *
// ********************************************

// Affiche ou réinitialise l'aperçu de l'image dans le formulaire
export const afficherAperçu = () => {
  const photoInput = document.getElementById("photo");
  const conteneurPrevisualisation = document.querySelector(".conteneur-apercu");
  conteneurPrevisualisation.innerHTML = "";
  conteneurPrevisualisation.style.display = "none";

  // Ajoute un écouteur pour détecter le changement de fichier
  photoInput.addEventListener("change", gererChargementImage);
};

// ********************************************
// * 4. Gestion des événements spécifiques *
// ********************************************

// Gère les événements liés au formulaire d'ajout
if (formulaireAjout) {
  formulaireAjout.addEventListener("input", () => {
    verifierChamps(); // Vérifie les champs en temps réel
  });

  formulaireAjout.addEventListener("submit", async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const imageProjet = inputImage.files[0];
    if (!imageProjet) {
      alert("Veuillez sélectionner une photo.");
      return;
    }

    const verification = verifierChamps();
    if (!verification.valide) {
      alert("Tous les champs doivent être remplis correctement.");
      return;
    }

    try {
      // Redimensionne l'image avant de l'envoyer au serveur
      const imageRedimensionnee = await redimensionnerImage(
        imageProjet,
        600,
        800
      );

      // Prépare les données pour l'envoi
      const formData = new FormData();
      formData.append("image", imageRedimensionnee);
      formData.append("title", titreProjet.value);
      formData.append("category", parseInt(categorieProjet.value, 10));

      await ajouterProjet(formData); // Envoie les données pour ajouter le projet
    } catch (error) {
      console.error(
        "Erreur lors du redimensionnement de l'image :",
        error.message
      );
      alert("Impossible de traiter l'image sélectionnée.");
    }
  });
}
