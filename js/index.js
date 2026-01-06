import { loadBannerCarousel } from './carrousels/banners_log.js';
import { createProductCarousel } from './carrousels/producto.js';
import { injectCartIntoHeader } from './cart/cart_ui.js';


import { cremas } from './data/cremas.js';
import { perfumes } from './data/perfumes.js';
import { cosmeticos } from './data/cosmeticos.js';

document.addEventListener('DOMContentLoaded', () => {
  loadBannerCarousel();

  createProductCarousel({
    containerSelector: '#cremas',
    products: cremas
  });

  createProductCarousel({
    containerSelector: '#perfumes',
    products: perfumes
  });

  createProductCarousel({
    containerSelector: '#maquillajes',
    products: cosmeticos
  });

  injectCartIntoHeader();


});
