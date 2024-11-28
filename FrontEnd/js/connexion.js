// ********************************************
// * 1. Importations et constantes globales *
// ********************************************
import { ouvrirGalerieModale } from "./gestionModale.js";

// Messages d'erreur pour les validations
const MESSAGES_ERREUR = {
  champsVides: "Erreur dans l'identifiant ou le mot de passe",
  emailInvalide: "Erreur dans l'identifiant ou le mot de passe",
};

// ********************************************
// * 2. Fonctions utilitaires *
// ********************************************

// Valide les champs du formulaire (email et mot de passe)
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

// Envoie une requête POST pour authentifier l'utilisateur
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
    })
    .catch((error) => {
      afficherMessageErreur(
        error.message || "Erreur réseau. Veuillez réessayer plus tard."
      );
    });
};

// Affiche un message d'erreur sous le formulaire de connexion
const afficherMessageErreur = (messageErreur) => {
  const messageConteneur = document.querySelector("#erreur-connexion");
  messageConteneur.innerHTML = "";
  const message = document.createElement("p");
  messageConteneur.appendChild(message);
  message.innerText = messageErreur;
};

// ********************************************
// * 3. Logique principale *
// ********************************************

// Vérifie si un token est présent pour activer le mode admin
const verifToken = sessionStorage.getItem("token");
if (verifToken) {
  // Mode admin (gestion de la barre d'édition et du bouton logout)
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
    document.getElementById("conteneur-titre-portfolio").appendChild(adminBtn);
    document.querySelector(".boutons-filtre").style.display = "none";
    document
      .querySelector(".js-modale")
      .addEventListener("click", ouvrirGalerieModale);

    const barreEdition = document.querySelector(".barre-mode-edition");
    barreEdition.style.display = "flex";
    const lienLog = document.getElementById("lien-log");
    lienLog.href = "./index.html";
    lienLog.innerHTML = "logout";

    const deconnecterUtilisateur = (e) => {
      e.preventDefault();
      document.querySelector(".boutons-filtre").style.display = "flex";
      adminBtn.remove();
      barreEdition.style.display = "none";
      lienLog.href = "./pages/login.html";
      lienLog.innerHTML = "login";
      sessionStorage.removeItem("token");
      lienLog.removeEventListener("click", deconnecterUtilisateur);
    };

    lienLog.addEventListener("click", deconnecterUtilisateur);
  }
}

// ********************************************
// * 4. Gestion des événements spécifiques *
// ********************************************

// Gestion du formulaire de connexion
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

// Message "Mot de passe oublié"
if (window.location.pathname.endsWith("login.html")) {
  const oubliBouton = document.getElementById("lien-oubli-mot-de-passe");
  oubliBouton.addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      "Fonction non prise en charge par la version actuelle de l'API (en cours de developpement)"
    );
  });
}

// Réinitialise les messages d'erreur au focus sur le champ mot de passe
const passwordInput = document.querySelector("#password");
const erreurConnexion = document.querySelector("#erreur-connexion");
if (passwordInput && erreurConnexion) {
  passwordInput.addEventListener("focus", () => {
    erreurConnexion.innerHTML = "";
  });
}
