const MEDICINE_IMAGE_MAP = [
  { match: ['paracetamol'], image: '/assets/medicines/paracetamol.svg' },
  { match: ['crocin'], image: '/assets/medicines/crocin.svg' },
  { match: ['amoxicillin'], image: '/assets/medicines/amoxicillin.svg' },
  { match: ['azithromycin'], image: '/assets/medicines/azithromycin.svg' },
  { match: ['dolo'], image: '/assets/medicines/dolo.svg' },
  { match: ['processing'], image: '/assets/images/no_image.svg' },
];

export const DEFAULT_MEDICINE_IMAGE = '/assets/images/no_image.svg';

export const getMedicineImageByName = (medicineName = '') => {
  const normalizedName = String(medicineName).toLowerCase();
  const match = MEDICINE_IMAGE_MAP.find((entry) =>
    entry.match.some((token) => normalizedName.includes(token))
  );

  return match?.image || DEFAULT_MEDICINE_IMAGE;
};

export const resolveMedicineImage = (medicineName, currentImage) => {
  if (typeof currentImage === 'string' && currentImage.trim()) {
    return currentImage;
  }

  return getMedicineImageByName(medicineName);
};
