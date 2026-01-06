import { getCartCount } from './cart_storage.js';

export function injectCartIntoHeader() {
  const header = document.querySelector('.headerContainer');
  if (!header || header.querySelector('.cartContainer')) return;

  const cartContainer = document.createElement('div');
  cartContainer.className = 'cartContainer';

  cartContainer.innerHTML = `
    <a class="cart" href="./checkout.html">🛒</a>
    <span class="cart-count" aria-live="polite">0</span>
  `;

  header.appendChild(cartContainer);
  updateCartCount();
}

export function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (!countEl) return;

  const total = getCartCount();
  countEl.textContent = total;
}
