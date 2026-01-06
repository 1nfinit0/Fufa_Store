import { banners } from '../data/banners.js';

export function loadBannerCarousel() {
  const bannersContainer = document.querySelector('.banners');
  if (!bannersContainer || !banners.length) return;

  /* =========================
     STRUCTURE
  ========================= */
  const carousel = document.createElement('div');
  carousel.className = 'carousel';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  let currentIndex = 0;
  let autoplayTimer = null;

  /* =========================
     SLIDES
  ========================= */
  banners.forEach((banner, i) => {
    const slide = document.createElement('a');
    slide.className = 'carousel-slide';
    slide.href = `/producto.html?id=${encodeURIComponent(banner.id)}`;
    slide.setAttribute('aria-label', banner.title);

    const img = document.createElement('img');

    /* Imagen principal derivada del id */
    img.src = `/assets/products/${banner.id}/${banner.id}.webp`;
    img.alt = banner.name;
    img.loading = 'lazy';


    const info = document.createElement('div');
    info.className = 'banner-info';
    info.innerHTML = `
      <h3>${banner.name}</h3>
      <p>${banner.description}</p>
      <span class="price">S/ ${banner.price}</span>
    `;

    slide.appendChild(img);
    slide.appendChild(info);
    track.appendChild(slide);

    /* DOT */
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Ir al banner ${i + 1}`);
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
      restartAutoplay();
    });

    dotsContainer.appendChild(dot);
  });

  carousel.appendChild(track);
  carousel.appendChild(dotsContainer);
  bannersContainer.appendChild(carousel);

  const total = banners.length;

  /* =========================
     CORE FUNCTIONS
  ========================= */
  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % total;
    updateCarousel();
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 4000);
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  /* =========================
     TOUCH / SWIPE
  ========================= */
  let startX = 0;
  let deltaX = 0;

  carousel.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    deltaX = 0;
    clearInterval(autoplayTimer);
  });

  carousel.addEventListener('touchmove', e => {
    deltaX = e.touches[0].clientX - startX;
  });

  carousel.addEventListener('touchend', () => {
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) {
        currentIndex = (currentIndex + 1) % total;
      } else {
        currentIndex = (currentIndex - 1 + total) % total;
      }
      updateCarousel();
    }
    startAutoplay();
  });

  /* INIT */
  updateCarousel();
  startAutoplay();
}
