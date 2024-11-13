document
  .querySelector("#connexion form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    validerEmail(email);
    if (!email || !password) {
      return showErrorMessage("Veuillez remplir tous les champs.");
    }

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((reponse) => {
        if (!reponse.ok) {
          throw new Error("Identifiants incorrects. Veuillez réessayer.");
        }
        return reponse.json(); // Extraction des données JSON
      })
      .then((jetonAuthentification) => {
        sessionStorage.setItem("token", jetonAuthentification.token);
        window.location.href = "../index.html";
      })
      .catch((error) => {
        console.error("Erreur :", error);
        showErrorMessage(
          error.message || "Erreur réseau. Veuillez réessayer plus tard."
        );
      });
  });

const validerEmail = (email) => {
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  if (!emailRegExp.test(email)) {
    showErrorMessage("L'email n'est pas valide.");
  }
};

const showErrorMessage = (errorMessage) => {
  const messageConteneur = document.querySelector("#erreur-connexion");
  messageConteneur.innerHTML = "";

  const message = document.createElement("p");
  messageConteneur.appendChild(message);

  message.innerText = errorMessage;
};
