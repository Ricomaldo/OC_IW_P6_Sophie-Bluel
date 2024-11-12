// login.js

// Sélectionne les éléments HTML pour l'email et le mot de passe soumis par l'utilisateur
const emailSoumis = document.getElementById("email");
const motdepasseSoumis = document.getElementById("password");

// Récupérer la valeur de l'email soumis lorsque le formulaire est soumis
const formulaire = document.querySelector("#connexion form");
formulaire.addEventListener("submit", async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  // Récupère les valeurs saisies pour l'email et le mot de passe
  const email = emailSoumis.value;
  const motdepasse = motdepasseSoumis.value;

  // Crée un objet contenant les informations de connexion de l'utilisateur
  const donneesConnexion = {
    email: email,
    password: motdepasse,
  };

  // Création de la charge utile au format JSON
  const chargeUtile = JSON.stringify(donneesConnexion);
  // Requête fetch
  const reponseServeur = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile,
  });
  console.log("Réponse serveur :", reponseServeur);
  const reponse = await reponseServeur.json(); // cette ligne m'a trop fait galerer !!! et pourtant c'est la plus simple au secorus !!!!

  console.log("réponse traduite", reponse);

  if (reponseServeur.ok === true) {
    const token = reponse.token;
    window.localStorage.setItem("token", token);
    window.location.href = "../index.html";
  } else {
    afficherMessageErreur("c'est la merde");
    //chatgpt vérifie cette ligne ci-dessous :
    emailSoumis.value = "";
    motdepasseSoumis.value = "";
  }
});

function afficherMessageErreur(texteMessage) {
  const conteneurMessageErreur = document.getElementById("erreur-connexion");

  if (conteneurMessageErreur.firstChild) {
    conteneurMessageErreur.removeChild(conteneurMessageErreur.firstChild);
  }
  const message = document.createElement("p");
  message.textContent = texteMessage;
  conteneurMessageErreur.appendChild(message);
}
