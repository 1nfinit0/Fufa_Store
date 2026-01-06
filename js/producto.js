import { findProductById } from './data/product_index.js';
import { getProductIdFromURL, renderNotFound } from './product/product_utils.js';
import { renderProduct } from './product/product_renderer.js';
import { initAddToCart } from './cart/product_cart.js';
import { injectCartIntoHeader } from './cart/cart_ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const productId = getProductIdFromURL();
  if (!productId) return renderNotFound();

  const product = findProductById(productId);
  if (!product) return renderNotFound();

  injectCartIntoHeader();
  renderProduct(product);
  initAddToCart(product);
});
