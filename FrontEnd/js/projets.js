// ********************************************
// * Récupération des projets *
// ********************************************

let projets = localStorage.getItem("projets");
if (!projets) {
  const urlApiConnexion = "http://localhost:5678/api/works";
  fetch(urlApiConnexion)
    .then((reponse) => reponse.json())
    .then((données) => {
      localStorage.setItem("projets", JSON.stringify(données));
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
    });
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

// ********************************************
// * Configuration de l'affichage des projets *
// ********************************************

const afficherProjets = (selectedProjets) => {
  const galerie = document.querySelector(".galerie");
  if (galerie) {
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

export const afficherVignettes = () => {
  const projets = JSON.parse(localStorage.getItem("projets"));
  const galerie = document.querySelector(".modale .galerie");
  galerie.innerHTML = "";

  projets.forEach((projet) => {
    const imageConteneur = document.createElement("div");
    imageConteneur.classList.add("projet-container");

    const projetImage = document.createElement("img");
    projetImage.src = projet.imageUrl;
    imageConteneur.appendChild(projetImage);

    const poubelleIcone = document.createElement("i");
    poubelleIcone.classList.add("fa-solid", "fa-trash-can");
    imageConteneur.appendChild(poubelleIcone);

    galerie.appendChild(imageConteneur);
    imageConteneur.addEventListener("click", (e) => {
      e.stopPropagation();
      supprimerImage(projet.id)
        .then(() => {
          console.log("Image supprimée avec succès.");
          imageConteneur.remove();
        })
        .catch((error) => console.error(error.message));
    });
  });
};

// ********************************************
// * Initialisation de l'affichage et des filtres *
// ********************************************
afficherProjets(projets);
genererBoutonsFiltres();
