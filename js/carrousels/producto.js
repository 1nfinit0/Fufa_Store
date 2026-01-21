import { BASE_PATH } from '../config.js';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createProductCarousel({
  containerSelector,
  products
}) {
  const container = document.querySelector(containerSelector);
  if (!container || !products.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'product-carousel';

  const track = document.createElement('div');
  track.className = 'product-track';

  
  const randomizedProducts = shuffleArray(products);

  randomizedProducts.forEach(product => {
    const card = document.createElement('a');
    card.className = 'product-card';
    card.href = `${BASE_PATH}producto.html?id=${encodeURIComponent(product.id)}`;

    const img = document.createElement('img');
    img.src = `${BASE_PATH}assets/products/${product.id}/${product.images?.[0] ?? `${product.id}.jpg`}`;
    img.alt = product.name;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.className = 'product-info';
    info.innerHTML = `
      <h4>${product.name}</h4>
      <span class="price">S/ ${product.price}</span>
    `;

    card.appendChild(img);
    card.appendChild(info);
    track.appendChild(card);
  });

  wrapper.appendChild(track);
  container.appendChild(wrapper);

  wrapper.addEventListener('wheel', e => {
    e.preventDefault();
    wrapper.scrollLeft += e.deltaY;
  });
}
