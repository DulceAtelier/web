// Cart functionality
let cart = [];

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Open cart modal
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
});

// Close cart modal
closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
});

// Close cart when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
    }
});

// Add to cart
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productName = button.getAttribute('data-name');
        const productPrice = parseFloat(button.getAttribute('data-price'));

        // Check if product already exists in cart
        const existingProduct = cart.find(item => item.name === productName);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        updateCart();
        
        // Visual feedback
        button.textContent = '✓ Agregado';
        setTimeout(() => {
            button.innerHTML = '🛒 Agregar';
        }, 1000);
    });
});

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="assets/cart_cake_icon.png" alt="Producto">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">S/ ${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.name}')">+</button>
                </div>
                <button class="remove-item" onclick="removeItem('${item.name}')">🗑️</button>
            </div>
        `).join('');
    }

    // Update total price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `S/ ${totalPrice.toFixed(2)}`;
}

// Increase quantity
function increaseQuantity(productName) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity++;
        updateCart();
    }
}

// Decrease quantity
function decreaseQuantity(productName) {
    const product = cart.find(item => item.name === productName);
    if (product && product.quantity > 1) {
        product.quantity--;
        updateCart();
    }
}

// Remove item
function removeItem(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
}

// Checkout via WhatsApp
checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Create WhatsApp message
    let message = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';
    
    cart.forEach(item => {
        message += `• ${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total: S/ ${totalPrice.toFixed(2)}*`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // WhatsApp link
    const whatsappLink = `https://wa.link/tbdv8t?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip cart icon and checkout button
        if (href === '#' || this.id === 'cart-icon' || this.id === 'checkout-btn') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});
