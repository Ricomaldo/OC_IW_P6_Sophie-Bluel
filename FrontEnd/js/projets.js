// ********************************************
// * Configuration de l'affichage des projets *
// ********************************************

export const afficherProjets = (selectedProjets) => {
  const galerie = document.querySelector(".galerie");
  if (galerie && projets) {
    galerie.innerHTML = "";
    for (let i = 0; i < selectedProjets.length; i++) {
      const projet = document.createElement("figure");
      const projetImage = document.createElement("img");
      const projetNom = document.createElement("figcaption");
      projet.setAttribute("class", `apparition apparition--${i + 1}`); //animation
      projetImage.src = projets[i].imageUrl;
      projetImage.alt = projets[i].title;
      projetNom.innerText = projets[i].title;
      galerie.appendChild(projet);
      projet.appendChild(projetImage);
      projet.appendChild(projetNom);
    }
  }
};

// ********************************************
// * Création des boutons de filtrage *
// ********************************************

const filtresDiv = document.querySelector(".boutons-filtre");
const creerBoutonFiltre = (categorie) => {
  const categorieBouton = document.createElement("button");
  categorieBouton.textContent = categorie;
  categorieBouton.setAttribute(
    "aria-label",
    categorie === "Tous"
      ? "Afficher tous les projets"
      : `Filtrer les projets pour afficher les projets de la catégorie ${categorie}`
  );
  if (filtresDiv) {
    filtresDiv.appendChild(categorieBouton);
    categorieBouton.addEventListener("click", () => {
      const filteredProjets = projets.filter((element) => {
        return categorie === "Tous"
          ? true
          : element.category.name === categorie;
      });
      afficherProjets(filteredProjets);
      console.log(
        "La catégorie selectionnée continent " +
          filteredProjets.length +
          " projets."
      );
    });
  }
};

const genererBoutonsFiltres = () => {
  const categorieSet = new Set();
  if (projets) {
    projets.forEach((projet) => {
      categorieSet.add(projet.category.name);
    });
    creerBoutonFiltre("Tous");
    for (let eachCategorie of categorieSet) {
      creerBoutonFiltre(eachCategorie);
    }
  }
};

// ********************************************
// * Récupération des projets et Initialisation de l'affichage
// ********************************************

let projets = localStorage.getItem("projets");
if (!projets) {
  const urlApiConnexion = "http://localhost:5678/api/works";
  fetch(urlApiConnexion)
    .then((reponse) => reponse.json())
    .then((data) => {
      localStorage.setItem("projets", JSON.stringify(data));
      projets = data;
      console.log("Nombre de projets chargés depuis l'API':", projets.length);
      afficherProjets(projets);
      genererBoutonsFiltres();
    })
    .catch((error) => {
      console.error("Erreur :", error);
      showErrorMessage(
        error.message || "Erreur réseau. Veuillez réessayer plus tard."
      );
    });
} else {
  projets = JSON.parse(projets);
  console.log("Nombre projets chargés depuis le cache:", projets.length);
  afficherProjets(projets);
  genererBoutonsFiltres();
}
