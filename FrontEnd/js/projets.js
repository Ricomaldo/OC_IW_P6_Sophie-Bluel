// projets.js

// Récupération des données (projets) et Appel des Fonctions d'affichage général
let projets = localStorage.getItem("projets");
if (!projets) {
  fetch("http://localhost:5678/api/works")
    .then((reponse) => reponse.json())
    .then((donnees) => {
      localStorage.setItem("projets", JSON.stringify(donnees));
      projets = donnees;
      console.log("Liste des projets chargés :", projets);
    })
    .catch((error) => {
      console.error("Erreur :", error);
      showErrorMessage(
        error.message || "Erreur réseau. Veuillez réessayer plus tard."
      );
    });
} else {
  projets = JSON.parse(projets);
  console.log("Liste des projets chargés :", projets);
}

// Déclaration des Fonctions
const afficherProjets = (selectedProjets) => {
  const galerie = document.querySelector(".galerie");
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
};

const genererBoutonsFiltres = () => {
  const categorieSet = new Set();
  projets.forEach((projet) => {
    categorieSet.add(projet.category.name);
  });
  console.log("Catégories uniques extraites :", categorieSet);
  creerBoutonFiltre("Tous");
  for (let eachCategorie of categorieSet) {
    creerBoutonFiltre(eachCategorie);
  }
};

const boutonsConteneur = document.querySelector(".boutons-filtre");
const creerBoutonFiltre = (categorie) => {
  const categorieBouton = document.createElement("button");
  categorieBouton.textContent = categorie;
  categorieBouton.setAttribute(
    "aria-label",
    categorie === "Tous"
      ? "Afficher tous les projets"
      : `Filtrer les projets pour afficher les projets de la catégorie ${categorie}`
  );
  boutonsConteneur.appendChild(categorieBouton);
  categorieBouton.addEventListener("click", () => {
    const filteredProjets = projets.filter((element) => {
      return categorie === "Tous" ? true : element.category.name === categorie;
    });
    afficherProjets(filteredProjets);
  });
};

afficherProjets(projets);
genererBoutonsFiltres();
