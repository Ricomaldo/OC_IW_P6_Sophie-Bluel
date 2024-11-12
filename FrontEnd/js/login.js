// login.js

document
  .querySelector("#connexion form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      return showErrorMessage("Veuillez remplir tous les champs.");
    }

    try {
      const reponseServeur = await fetch(
        "http://localhost:5678/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const reponse = await reponseServeur.json();

      if (reponseServeur.ok) {
        localStorage.setItem("token", reponse.token);
        window.location.href = "../index.html";
      } else {
        showErrorMessage("Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (error) {
      showErrorMessage("Erreur réseau. Veuillez réessayer plus tard.");
    }
  });

const showErrorMessage = (message) => {
  document.getElementById("erreur-connexion").textContent = message;
};
