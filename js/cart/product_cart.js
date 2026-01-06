import {
  getCart,
  saveCart,
  findItem,
  MAX_QTY
} from './cart_storage.js';

import { updateCartCount } from './cart_ui.js';
import { BASE_PATH } from '../config.js';


/* =========================
   QUANTITY CONTROL
========================= */
function initQuantityControls() {
  const container = document.querySelector('.cantidad');
  if (!container) return () => 1;

  const minus = container.querySelector('button:first-child');
  const plus = container.querySelector('button:last-child');
  const value = container.querySelector('span');

  let quantity = 1;

  function updateUI() {
    value.textContent = quantity;
  }

  minus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      updateUI();
    }
  });

  plus.addEventListener('click', () => {
    if (quantity < MAX_QTY) {
      quantity++;
      updateUI();
    }
  });

  updateUI();
  return () => quantity;
}

/* =========================
   ADD TO CART
========================= */
export function initAddToCart(product) {
  const button = document.querySelector('.agregarCarrito');
  if (!button) return;

  const getQuantity = initQuantityControls();

  button.addEventListener('click', () => {
    const cart = getCart();
    const quantity = getQuantity();

    const existing = findItem(cart, product.id);

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + quantity,
        MAX_QTY
      );
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images,
        quantity
      });
    }

    saveCart(cart);
    updateCartCount();
    switchToGoCart(button);
  });
}

/* =========================
   UI STATES
========================= */
function switchToGoCart(button) {
  button.textContent = 'Ir al carrito';
  button.onclick = () => {
    window.location.href = `${BASE_PATH}checkout.html`;
  };
}

