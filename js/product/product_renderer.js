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

  let startX = 0;

  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && currentIndex < product.images.length - 1) currentIndex++;
      else if (diff > 0 && currentIndex > 0) currentIndex--;
      updateCarousel();
    }
  });

  updateCarousel();

  /* =========================
     PRODUCT INFO
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
     MARKETING / VIDEOS
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
    video.src = basePath + videoName;

    // 🔑 CLAVES PARA AUTOPLAY REAL
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.volume = 0.75;
    video.className = 'marketingVideo';

    // Estado interno
    video.dataset.shouldPlay = 'false';

    video.addEventListener('canplay', () => {
      if (video.dataset.shouldPlay === 'true') {
        video.play().catch(() => {});
      }
    });

    const muteBtn = document.createElement('button');
    muteBtn.className = 'videoMuteBtn';
    muteBtn.textContent = '🔇';

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      video.volume = 0.75;
      muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    wrapper.appendChild(video);
    wrapper.appendChild(muteBtn);
    marketingContainer.appendChild(wrapper);

    videos.push(video);
  });

/* =========================
   SMART AUTOPLAY (IMPROVED VERSION)
========================= */

let intersectionObserver;

// Inicializar el observer una sola vez si no existe
if (!intersectionObserver) {
  intersectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const video = entry.target;
        const container = video.parentElement;
        
        if (entry.isIntersecting) {
          // Cuando el video entra en la zona visible
          video.dataset.shouldPlay = 'true';
          
          // Intentar reproducir inmediatamente
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              // Si falla, intentar con muted
              if (!video.muted) {
                video.muted = true;
                video.play().catch(() => {});
              }
            });
          }
          
          // Marcar el contenedor como activo
          container.classList.add('video-active');
        } else {
          // Cuando el video sale de la zona visible
          video.dataset.shouldPlay = 'false';
          video.pause();
          container.classList.remove('video-active');
        }
      });
    },
    {
      // Ajustar estos valores para que se active cuando esté más centrado
      rootMargin: '-15% 0px -15% 0px',
      threshold: 0.1
    }
  );
}

// FUNCIÓN MEJORADA PARA INICIAR VIDEOS
function initVideosAutoplay() {
  // Esperar a que el DOM esté completamente listo
  setTimeout(() => {
    videos.forEach(video => {
      // Observar el video
      intersectionObserver.observe(video);
      
      // Configurar el video para autoplay
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', '');
      
      // Intentar reproducir inmediatamente si está visible
      setTimeout(() => {
        checkAndPlayVideo(video);
      }, 100);
    });
  }, 300); // Darle más tiempo al navegador para procesar
}

// FUNCIÓN PARA VERIFICAR Y REPRODUCIR
function checkAndPlayVideo(video) {
  const rect = video.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Calcular si está en el centro de la pantalla (40%-60%)
  const isCentered = (
    rect.top <= windowHeight * 0.5 &&
    rect.bottom >= windowHeight * 0.5
  );
  
  // Verificar si ya está cargado lo suficiente
  const isReady = video.readyState >= 3; // HAVE_FUTURE_DATA o más
  
  if (isCentered && isReady) {
    video.dataset.shouldPlay = 'true';
    
    // Intentar reproducir
    video.play().then(() => {
      console.log('Video reproduciéndose automáticamente');
    }).catch(error => {
      // Si falla, intentar silenciado
      if (!video.muted) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
  }
}

// AGREGAR EVENTOS DE CARGA MEJORADOS
videos.forEach(video => {
  // Manejar el evento loadedmetadata mejor
  video.addEventListener('loadedmetadata', () => {
    video.dataset.loaded = 'true';
    
    // Verificar si debe reproducirse inmediatamente
    setTimeout(() => {
      checkAndPlayVideo(video);
    }, 50);
  });
  
  // Manejar el evento canplaythrough
  video.addEventListener('canplaythrough', () => {
    video.dataset.ready = 'true';
  });
  
  // Cargar el video inmediatamente
  video.load();
});

// REEMPLAZAR LA LLAMADA ACTUAL CON:
// En lugar de videos.forEach(video => observer.observe(video));
initVideosAutoplay();

// AGREGAR EVENTO DE SCROLL PARA VERIFICAR VIDEOS
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    videos.forEach(video => {
      if (video.dataset.shouldPlay === 'false') {
        checkAndPlayVideo(video);
      }
    });
  }, 150);
});

// VERIFICAR CUANDO SE CARGA LA PÁGINA COMPLETA
window.addEventListener('load', () => {
  setTimeout(() => {
    videos.forEach(video => {
      checkAndPlayVideo(video);
    });
  }, 500);
});

// RESET OBSERVER CUANDO SE CAMBIA DE PRODUCTO
// Agregar esto al inicio de tu función renderProduct
if (intersectionObserver) {
  intersectionObserver.disconnect();
}

  /* =========================
     ENABLE AUDIO ON INTERACTION
  ========================= */
  let userInteracted = false;

  function enableSoundOnInteraction() {
    if (userInteracted) return;
    userInteracted = true;

    document.querySelectorAll('.marketingVideo').forEach(video => {
      video.muted = false;
      video.volume = 0.75;

      const btn = video.parentElement.querySelector('.videoMuteBtn');
      if (btn) btn.textContent = '🔇';
    });
  }

  document.addEventListener('click', enableSoundOnInteraction, { once: true });
  document.addEventListener('touchstart', enableSoundOnInteraction, { once: true });

  /* =========================
   SIMPLE EXCLUSIVE VIDEO SOLUTION
========================= */

let activeVideo = null;

const exclusiveObserver = new IntersectionObserver(
  entries => {
    // Ordenar por porcentaje de intersección (más visible primero)
    entries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    
    // Pausar todos los videos primero
    entries.forEach(entry => {
      const video = entry.target;
      if (!video.paused) {
        video.pause();
        video.dataset.shouldPlay = 'false';
        video.parentElement.classList.remove('video-active');
      }
    });
    
    // Reproducir solo el más visible (si tiene suficiente intersección)
    const mostVisible = entries[0];
    if (mostVisible && mostVisible.intersectionRatio > 0.3) {
      const video = mostVisible.target;
      video.play().then(() => {
        video.dataset.shouldPlay = 'true';
        video.parentElement.classList.add('video-active');
        activeVideo = video;
      }).catch(() => {
        if (!video.muted) {
          video.muted = true;
          video.play().catch(() => {});
        }
      });
    }
  },
  {
    threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9]
  }
);

// Configurar videos
videos.forEach(video => {
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  
  exclusiveObserver.observe(video);
});

// Scroll optimizado para esta solución
let scrollTimer;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    // Forzar re-evaluación de todos los videos
    videos.forEach(video => {
      const rect = video.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        // Trigger fake intersection
        exclusiveObserver.unobserve(video);
        exclusiveObserver.observe(video);
      }
    });
  }, 100);
});
}
