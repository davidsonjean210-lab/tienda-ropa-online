// Lista inicial de productos
const products = [
  { id: 1, name: "Chaqueta Campera Urbana", price: 29.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
  { id: 2, name: "Camiseta Algodón Casual", price: 12.50, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400" },
  { id: 3, name: "Sudadera Oversize Hoodie", price: 24.99, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400" },
  { id: 4, name: "Pantalón Jean Moderno", price: 34.00, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400" }
];

let cart = [];

// Elementos del DOM
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');

// Renderizar productos
function displayProducts() {
  productGrid.innerHTML = products.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="add-btn" onclick="addToCart(${product.id})">Añadir al Carrito</button>
    </div>
  `).join('');
}

// Agregar al carrito
function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

// Actualizar vista del carrito
function updateCart() {
  cartCount.textContent = cart.length;
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>El carrito está vacío.</p>';
    cartTotal.textContent = '0.00';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
      <span>${item.name}</span>
      <span>$${item.price.toFixed(2)}</span>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = total.toFixed(2);
}

// Abrir / Cerrar Carrito
cartBtn.addEventListener('click', () => cartModal.style.display = 'flex');
closeCart.addEventListener('click', () => cartModal.style.display = 'none');

// Configuración de Botones de PayPal
paypal.Buttons({
  createOrder: (data, actions) => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (total <= 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    return actions.order.create({
      purchase_units: [{
        amount: { value: total.toFixed(2) }
      }]
    });
  },
  onApprove: (data, actions) => {
    return actions.order.capture().then(details => {
      alert('¡Pago completado con éxito por ' + details.payer.name.given_name + '!');
      cart = [];
      updateCart();
      cartModal.style.display = 'none';
    });
  }
}).render('#paypal-button-container');

// Inicializar
displayProducts();