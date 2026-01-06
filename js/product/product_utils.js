/* =========================
   UTILIDADES
========================= */
export function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

export function renderNotFound() {
  const container = document.querySelector('.productoContainer');
  if (!container) return;

  container.innerHTML = `
    <h2>Producto no encontrado</h2>
    <a href="./index.html">Volver al inicio</a>
  `;
}
