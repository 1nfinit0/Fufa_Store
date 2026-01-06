import { banners } from './banners.js';
import { cremas } from './cremas.js';
import { perfumes } from './perfumes.js';
import { cosmeticos } from './cosmeticos.js';

const collections = {
  banners,
  cremas,
  perfumes,
  cosmeticos
};

export function findProductById(id) {
  for (const [collectionName, items] of Object.entries(collections)) {
    const product = items.find(item => item.id === id);
    if (product) {
      return {
        ...product,
        category: collectionName
      };
    }
  }
  return null;
}
