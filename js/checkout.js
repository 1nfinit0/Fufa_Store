import { getCart, saveCart } from './cart/cart_storage.js';
import { injectCartIntoHeader, updateCartCount } from './cart/cart_ui.js';
import { BASE_PATH } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  injectCartIntoHeader();
  renderCheckout();
});

/* =========================
   RENDER
========================= */
function renderCheckout() {
  const cartList = document.querySelector('.cartList');
  const totalEl = document.querySelector('.cartTotal');

  const cart = getCart();
  cartList.innerHTML = '';

  if (!cart.length) {
    cartList.innerHTML = '<p>Tu carrito está vacío</p>';
    totalEl.textContent = 'S/ 0';
    setupCheckoutButton(cart, 0);
    return;
  }


  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const imageSrc =
      `${BASE_PATH}assets/products/${item.id}/${item.image[0]}`;

    const row = document.createElement('div');
    row.className = 'cartItem';

    row.innerHTML = `
      <img src="${imageSrc}" alt="${item.name}">
      <div class="cartItemInfo">
        <h3>${item.name}</h3>
        <span>S/ ${item.price} × ${item.quantity}</span>
      </div>
      <div class="cartItemActions">
        <button class="minus">−</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
        <button class="remove">✕</button>
      </div>
    `;

    attachActions(row, item.id);
    cartList.appendChild(row);
  });

  totalEl.textContent = `S/ ${total}`;
  setupCheckoutButton(cart, total);
}


/* =========================
   ACTIONS
========================= */
function attachActions(row, productId) {
  const minus = row.querySelector('.minus');
  const plus = row.querySelector('.plus');
  const remove = row.querySelector('.remove');

  minus.addEventListener('click', () => updateQty(productId, -1));
  plus.addEventListener('click', () => updateQty(productId, 1));

  remove.addEventListener('click', () => {
    const ok = confirm('¿Seguro que deseas eliminar este producto del carrito?');
    if (!ok) return;

    removeItem(productId);
  });
}

function generateOrderCode() {
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const rnd = Math.floor(1000 + Math.random() * 9000);

  return `${dd}/${mm}/${yy}/${rnd}`;
}
function buildWhatsappMessage(cart, total, orderCode) {
  let message = `🛍️ *NUEVO PEDIDO*\n\n`;
  message += `📦 *Código:* ${orderCode}\n\n`;
  message += `🧾 *Detalle del pedido:*\n\n`;

  cart.forEach(item => {
    message += `• ${item.name}\n`;
    message += `  Cantidad: ${item.quantity}\n`;
    message += `  Precio: S/ ${item.price}\n\n`;
  });

  message += `💰 *Total:* S/ ${total}\n\n`;

  return encodeURIComponent(message);
}

function setupCheckoutButton(cart, total) {
  const btn = document.querySelector('.checkoutBtn');
  if (!btn) return;

  if (!cart.length) {
    btn.textContent = 'Aún no tienes productos';
    btn.disabled = true;
    return;
  }

  btn.textContent = 'Hacer pedido';
  btn.disabled = false;

  btn.onclick = () => {
    const orderCode = generateOrderCode();
    const message = buildWhatsappMessage(cart, total, orderCode);

    const phone = '51997913969';
    const url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, '_blank');
  };
}



function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity < 1) {
    removeItem(productId);
    return;
  }

  if (item.quantity > 5) {
    item.quantity = 5;
  }

  saveCart(cart);
  updateCartCount();
  renderCheckout();
}

function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);

  saveCart(cart);
  updateCartCount();
  renderCheckout();
}

