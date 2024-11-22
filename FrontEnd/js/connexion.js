// ********************************************
// * Importations  *
// ********************************************

import { ouvrirModaleGalerie } from "./gestionModale.js";

// ********************************************
// * Configuration du bouton admnin * création, affichage, activation (et suppression de la barre de boutons de catégorie)
// ********************************************

const verifToken = sessionStorage.getItem("token");
if (verifToken) {
  const adminBtn = document.createElement("div");
  adminBtn.classList.add("js-modale");
  adminBtn.id = "admin-btn";
  adminBtn.setAttribute(
    "aria-label",
    "Ouvrir la modale d'administration pour ajouter ou supprimer des images du portfolio"
  );
  adminBtn.innerHTML = `
  <i class="fa-regular fa-pen-to-square"></i>
  <p>modifier</p>
`;
  if (window.location.pathname.endsWith("index.html")) {
    document.getElementById("conteneur-titre").appendChild(adminBtn);
    document.querySelector(".boutons-filtre").innerHTML = "";
    document
      .querySelector(".js-modale")
      .addEventListener("click", ouvrirModaleGalerie);
  }
}

// ********************************************
// * Fonctionnalités liées au formulaire de connexion *
// ********************************************

const MESSAGES_ERREUR = {
  champsVides: "Erreur dans l'identifiant ou le mot de passe",
  emailInvalide: "Erreur dans l'identifiant ou le mot de passe",
};

const formulaireConnexion = document.querySelector("#connexion form");
if (formulaireConnexion) {
  formulaireConnexion.addEventListener("submit", (e) => {
    e.preventDefault();
    const adresseEmail = document.getElementById("email").value;
    const motDePasse = document.getElementById("password").value;

    const validation = validerChamps(adresseEmail, motDePasse);
    if (!validation.valide) {
      afficherMessageErreur(MESSAGES_ERREUR[validation.erreur]);
      return;
    }

    const urlApiConnexion = "http://localhost:5678/api/users/login";
    const identifiants = { email: adresseEmail, password: motDePasse };
    authentifierUtilisateur(urlApiConnexion, identifiants);
  });
}

const validerChamps = (email, motDePasse) => {
  if (!email || !motDePasse) {
    return { valide: false, erreur: "champsVides" };
  }

  const expressionReguliereEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!expressionReguliereEmail.test(email)) {
    return { valide: false, erreur: "emailInvalide" };
  }

  return { valide: true };
};

const authentifierUtilisateur = (urlApiConnexion, identifiants) => {
  fetch(urlApiConnexion, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(identifiants),
  })
    .then((reponse) => {
      if (!reponse.ok) {
        throw new Error("Erreur dans l'identifiant ou le mot de passe");
      }
      return reponse.json();
    })
    .then((jetonAuthentification) => {
      sessionStorage.setItem("token", jetonAuthentification.token);
      const messageConteneur = document.querySelector("#erreur-connexion");
      if (messageConteneur) {
        messageConteneur.innerHTML = "";
      }
      window.location.href = "../index.html";
      console.log(
        `✅ Authentification réussie pour l'utilisateur : ${username}.`
      );
    })
    .catch((error) => {
      console.error("Erreur :", error);
      afficherMessageErreur(
        error.message || "Erreur réseau. Veuillez réessayer plus tard."
      );
    });
};

const afficherMessageErreur = (messageErreur) => {
  const messageConteneur = document.querySelector("#erreur-connexion");
  messageConteneur.innerHTML = "";

  const message = document.createElement("p");
  messageConteneur.appendChild(message);

  message.innerText = messageErreur;
};

if (window.location.pathname.endsWith("login.html")) {
  const oubliBouton = document.getElementById("oubli-mot-de-passe");
  oubliBouton.addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      "Fonction non prise en charge par la version actuelle de l'API (en cours de developpement)"
    );
  });
}

// ecouteur du focus du champs du mot de passe pour effacer le msg
const passwordInput = document.querySelector("#password");
const erreurConnexion = document.querySelector("#erreur-connexion");
if (passwordInput && erreurConnexion) {
  passwordInput.addEventListener("focus", () => {
    erreurConnexion.innerHTML = "";
  });
}
