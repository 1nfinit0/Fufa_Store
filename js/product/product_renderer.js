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


    /* =========================
     MARKETING / REFERENCIAS
  ========================= */
  const marketingContainer = document.querySelector('.marketingMedia');
  marketingContainer.innerHTML = '';

  if (!product.referencias || !product.referencias.length) {
    marketingContainer.parentElement.style.display = 'none';
    return;
  }

  const videos = [];

  product.referencias.forEach(videoName => {
    const wrapper = document.createElement('div');
    wrapper.className = 'marketingVideoWrapper';

    const video = document.createElement('video');
    video.src = `${basePath}${videoName}`;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.className = 'marketingVideo';

    const muteBtn = document.createElement('button');
    muteBtn.className = 'videoMuteBtn';
    muteBtn.textContent = '🔇';

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    wrapper.appendChild(video);
    wrapper.appendChild(muteBtn);
    marketingContainer.appendChild(wrapper);

    videos.push(video);
  });

  /* =========================
     AUTOPLAY INTELIGENTE
  ========================= */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: [0.6] 
    }
  );

  videos.forEach(video => observer.observe(video));

  let userInteracted = false;

function enableSoundOnInteraction() {
  if (userInteracted) return;

  userInteracted = true;

  document.querySelectorAll('.marketingVideo').forEach(video => {
  video.muted = false;
  video.parentElement
    .querySelector('.videoMuteBtn')
    .textContent = '🔊';
});


  document.removeEventListener('touchstart', enableSoundOnInteraction);
  document.removeEventListener('click', enableSoundOnInteraction);
}

document.addEventListener('touchstart', enableSoundOnInteraction, { once: true });
document.addEventListener('click', enableSoundOnInteraction, { once: true });


}
