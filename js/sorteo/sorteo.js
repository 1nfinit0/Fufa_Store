  const overlay = document.getElementById('promoOverlay');
  const promo = document.getElementById('promoFlotante');
  const closeBtn = document.getElementById('closePromo');

  function cerrarPromo() {
    overlay.style.display = 'none';
  }

  // Cerrar con botón
  closeBtn.addEventListener('click', cerrarPromo);

  // Cerrar al hacer click fuera
  overlay.addEventListener('click', (e) => {
    if (!promo.contains(e.target)) {
      cerrarPromo();
    }
  });