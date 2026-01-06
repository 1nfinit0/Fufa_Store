export const CART_KEY = 'fufa_cart';
export const MAX_QTY = 5;

export function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function findItem(cart, productId) {
  return cart.find(item => item.id === productId);
}
