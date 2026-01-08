import { loadBannerCarousel } from './carrousels/banners_log.js';
import { createProductCarousel } from './carrousels/producto.js';
import { injectCartIntoHeader } from './cart/cart_ui.js';


import { cuidado } from './data/cuidado.js';
import { perfumes } from './data/perfumes.js';
import { cosmeticos } from './data/cosmeticos.js';

document.addEventListener('DOMContentLoaded', () => {
  loadBannerCarousel();

  createProductCarousel({
    containerSelector: '#cuidado',
    products: cuidado
  });

  createProductCarousel({
    containerSelector: '#perfumes',
    products: perfumes
  });

  createProductCarousel({
    containerSelector: '#proteccion',
    products: cosmeticos
  });

  injectCartIntoHeader();


});
