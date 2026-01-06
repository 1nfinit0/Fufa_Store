import { BASE_PATH } from '../config.js';

export function renderProduct(product) {
  document.title = product.name || 'Producto';

  /* =========================
     IMAGE CAROUSEL
  ========================= */
  const container = document.querySelector('.productoImgCarrousel');
  const track = container.querySelector('.carousel-track');
  const dots = container.querySelector('.carousel-dots');

  track.innerHTML = '';
  dots.innerHTML = '';

  let currentIndex = 0;
  const basePath = `${BASE_PATH}assets/products/${product.id}/`;

  product.images.forEach((imgName, i) => {
    const img = document.createElement('img');
    img.src = basePath + imgName;
    img.alt = product.name;
    img.loading = 'lazy';
    track.appendChild(img);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
    dots.appendChild(dot);
  });

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    [...dots.children].forEach((d, i) =>
      d.classList.toggle('active', i === currentIndex)
    );
  }

  /* =========================
     TOUCH SWIPE
  ========================= */
  let startX = 0;

  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentIndex < product.images.length - 1) {
        currentIndex++;
      } else if (diff > 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
    }
  });

  updateCarousel();

  /* =========================
     RESTO DEL PRODUCTO
  ========================= */
  document.querySelector('.productoDetalles h1').textContent = product.name;
  document.querySelector('.productoDescripcion').textContent = product.description;
  document.querySelector('.productoPrecio').textContent = `S/ ${product.price}`;

  const catalogo = document.querySelector('.catalogo');
  if (product.catalogoPrice) {
    catalogo.textContent = `📖 Precio en catálogo: S/ ${product.catalogoPrice}`;
  } else {
    catalogo.style.display = 'none';
  }
}
