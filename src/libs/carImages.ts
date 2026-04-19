/**
 * Utility functions for car image randomization
 * Provides consistent image selection based on ID using hashing
 */

const carImages = [
  "/img/car1.png",
  "/img/car2.png",
  "/img/car3.png",
  "/img/car4.png",
];

const allImages = [
  "/img/banner1.png",
  "/img/banner2.png",
  "/img/banner3.png",
  "/img/car1.png",
  "/img/car2.png",
  "/img/car3.png",
  "/img/car4.png",
];

/**
 * Hash a string to a consistent numeric value
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 7) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Get a consistent car image based on an ID (e.g., provider ID)
 * Same ID will always return the same image
 */
export function getCarImageFromId(id: string): string {
  const index = hashString(id) % carImages.length;
  return carImages[index];
}

/**
 * Get a consistent image from the full image set based on an ID
 * Same ID will always return the same image
 */
export function getImageFromId(id: string): string {
  const index = hashString(id) % allImages.length;
  return allImages[index];
}

export { carImages, allImages };