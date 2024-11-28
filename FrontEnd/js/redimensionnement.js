// ********************************************
// * Fonction de redimensionnement d'image *
// ********************************************

/**
 * Redimensionne et recadre une image en ratio 3:4 avant l'envoi.
 * @param {File} file - Fichier image sélectionné.
 * @param {number} largeurCible - Largeur souhaitée (par défaut 600px).
 * @param {number} hauteurCible - Hauteur souhaitée (par défaut 800px).
 * @returns {Promise<File>} - Une promesse qui retourne l'image transformée sous forme de fichier.
 */
export const redimensionnerImage = (
  file,
  largeurCible = 600,
  hauteurCible = 800
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // Création d'un canvas pour redimensionner l'image
        const canvas = document.createElement("canvas");
        canvas.width = largeurCible;
        canvas.height = hauteurCible;

        const ctx = canvas.getContext("2d");

        // Calcul pour recadrer l'image tout en respectant le ratio 3:4
        const ratioImage = img.width / img.height;
        const ratioCible = largeurCible / hauteurCible;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;

        if (ratioImage > ratioCible) {
          // L'image est plus large que le ratio cible, recadrer horizontalement
          sourceWidth = img.height * ratioCible;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // L'image est plus haute que le ratio cible, recadrer verticalement
          sourceHeight = img.width / ratioCible;
          sourceY = (img.height - sourceHeight) / 2;
        }

        // Dessiner l'image recadrée sur le canvas
        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          largeurCible,
          hauteurCible
        );

        // Convertir le canvas en fichier Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Créer un nouveau fichier à partir du Blob
              const fichierRedimensionne = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(fichierRedimensionne); // Retourner le fichier redimensionné
            } else {
              reject(new Error("Échec de la conversion de l'image."));
            }
          },
          file.type,
          0.9 // Qualité de l'image (90%)
        );
      };

      img.onerror = () =>
        reject(new Error("Erreur lors du chargement de l'image."));
    };

    reader.onerror = () => reject(new Error("Erreur de lecture du fichier."));
    reader.readAsDataURL(file); // Lire l'image sous forme de Data URL
  });
};
