// works.js

//Récupération des travaux présents dans le LocalStorage
let works = window.localStorage.getItem("works");

export async function afficherTravaux() {
  //Récupération des travaux avec appel API si LocalStorage vide
  if (works === null) {
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();
    window.localStorage.setItem("works", JSON.stringify(works));
  } else {
    // Sinon conversion au format json
    works = JSON.parse(works);
  }

  //Génération de la gallerie
  for (let i = 0; i < works.length; i++) {
    const projet = works[i];
    // Récupération de l'élément du DOM qui accueillera les travaux
    const gallery = document.querySelector(".gallery");

    // Création d’une balise dédiée à un projet
    const worksElement = document.createElement("figure");
    worksElement.dataset.id = projet.id;

    // Création des balises pour les éléments du projet
    const imageElement = document.createElement("img");
    imageElement.src = projet.imageUrl;
    imageElement.alt = projet.title;
    const titleElement = document.createElement("figcaption");
    titleElement.innerText = projet.title;

    // Rattachement de la balise figure a la section Gallery
    gallery.appendChild(worksElement);
    worksElement.appendChild(imageElement);
    worksElement.appendChild(titleElement);
  }
}
