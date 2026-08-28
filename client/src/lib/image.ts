/** Côté maquette comme ici : l'image est ramenée à 1000 px sur son plus grand côté
 *  avant d'être envoyée, pour ne pas stocker des fichiers d'appareil photo entiers. */
const MAX_EDGE = 1000;
const QUALITY = 0.82;

export function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("impossible de préparer l'image"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("impossible de préparer l'image"))),
        'image/jpeg',
        QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('fichier image illisible'));
    };

    img.src = url;
  });
}
