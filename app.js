// Product data
const productData = {
  smartwatches: [
    {
      id: 1,
      name: "TRAND Pro Max",
      category: "Smart Watches",
      subcategory: "AMOLED Display",
      price: 2999,
      originalPrice: 3999,
      discount: "25% OFF",
      rating: 4.5,
      reviews: 1247,
      features: ["BT Calling", "AMOLED Display", "Heart Rate Monitor", "50+ Sports Modes"],
      colors: ["Black", "Silver", "Rose Gold"],
      icon: "fas fa-clock",
      description: "Premium smartwatch with AMOLED display and advanced health tracking"
    },
    {
      id: 2,
      name: "TRAND Fit Ultra",
      category: "Smart Watches",
      subcategory: "Fitness Focus",
      price: 1999,
      originalPrice: 2499,
      discount: "20% OFF",
      rating: 4.3,
      reviews: 892,
      features: ["100+ Workout Modes", "SpO2 Monitor", "Water Resistant"],
      colors: ["Black", "Blue", "Green"],
      icon: "fas fa-heartbeat",
      description: "Fitness-focused smartwatch with comprehensive health monitoring"
    },
    {
      id: 3,
      name: "TRAND Classic Round",
      category: "Smart Watches",
      subcategory: "Round Dial",
      price: 1599,
      originalPrice: 1999,
      discount: "20% OFF",
      rating: 4.2,
      reviews: 654,
      features: ["Round Display", "7-Day Battery", "Always-On Display"],
      colors: ["Black", "Silver"],
      icon: "far fa-clock",
      description: "Classic round smartwatch with elegant design"
    }
  ],
  earbuds: [
    {
      id: 4,
      name: "TRAND Buds Pro",
      category: "Earbuds",
      subcategory: "ANC",
      price: 1499,
      originalPrice: 1999,
      discount: "25% OFF",
      rating: 4.4,
      reviews: 2156,
      features: ["Active Noise Cancellation", "50Hr Playback", "Quad Mic ENC"],
      colors: ["Black", "White", "Blue"],
      icon: "fas fa-headphones",
      description: "Premium TWS earbuds with active noise cancellation"
    },
    {
      id: 5,
      name: "TRAND Buds Gaming",
      category: "Earbuds",
      subcategory: "Gaming",
      price: 999,
      originalPrice: 1299,
      discount: "23% OFF",
      rating: 4.3,
      reviews: 1643,
      features: ["Low Latency", "Gaming Mode", "RGB LED"],
      colors: ["Black", "Red"],
      icon: "fas fa-gamepad",
      description: "Gaming earbuds with ultra-low latency for competitive gaming"
    },
    {
      id: 6,
      name: "TRAND Buds Lite",
      category: "Earbuds",
      subcategory: "Budget",
      price: 799,
      originalPrice: 999,
      discount: "20% OFF",
      rating: 4.1,
      reviews: 987,
      features: ["25Hr Playback", "Touch Control", "IPX4"],
      colors: ["Black", "White"],
      icon: "fas fa-music",
      description: "Affordable TWS earbuds with essential features"
    }
  ],
  accessories: [
    {
      id: 7,
      name: "TRAND Wireless Charger",
      category: "Accessories",
      subcategory: "Chargers",
      price: 599,
      originalPrice: 799,
      discount: "25% OFF",
      rating: 4.2,
      reviews: 445,
      features: ["15W Fast Charging", "LED Indicator", "Over-current Protection"],
      colors: ["Black", "White"],
      icon: "fas fa-charging-station",
      description: "Fast wireless charging pad for smartphones and earbuds"
    },
    {
      id: 8,
      name: "TRAND Watch Strap Premium",
      category: "Accessories",
      subcategory: "Watch Straps",
      price: 399,
      originalPrice: 499,
      discount: "20% OFF",
      rating: 4.0,
      reviews: 234,
      features: ["Premium Material", "Universal Fit", "Quick Release"],
      colors: ["Black", "Brown", "Blue"],
      icon: "fas fa-link",
      description: "Premium quality replacement strap for smartwatches"
    }
  ]
};

// Global state
let cart = [];
let wishlist = [];
let filteredProducts = [];
let currentCategory = 'all';
let currentSort = 'featured';
let allProducts = [];

// DOM Elements
let productsGrid, cartBtn, cartCount, cartSidebar, closeSidebar, cartContent, cartFooter, cartTotal;
let productModal, modalContent, closeModal, categoryFilter, sortFilter, searchInput, searchBtn;
let heroSlider, mobileMenuBtn, mainNav;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeDOMElements();
  initializeProducts();
  initializeHeroSlider();
  initializeEventListeners();
  loadCartFromStorage();
  loadWishlistFromStorage();
});

// Initialize DOM elements
function initializeDOMElements() {
  productsGrid = document.getElementById('productsGrid');
  cartBtn = document.getElementById('cartBtn');
  cartCount = document.getElementById('cartCount');
  cartSidebar = document.getElementById('cartSidebar');
  closeSidebar = document.getElementById('closeSidebar');
  cartContent = document.getElementById('cartContent');
  cartFooter = document.getElementById('cartFooter');
  cartTotal = document.getElementById('cartTotal');
  productModal = document.getElementById('productModal');
  modalContent = document.getElementById('modalContent');
  closeModal = document.getElementById('closeModal');
  categoryFilter = document.getElementById('categoryFilter');
  sortFilter = document.getElementById('sortFilter');
  searchInput = document.getElementById('searchInput');
  searchBtn = document.getElementById('searchBtn');
  heroSlider = document.getElementById('heroSlider');
  mobileMenuBtn = document.getElementById('mobileMenuBtn');
  mainNav = document.getElementById('mainNav');
}

// Initialize products display
function initializeProducts() {
  allProducts = [...productData.smartwatches, ...productData.earbuds, ...productData.accessories];
  filteredProducts = [...allProducts];
  renderProducts();
}

// Render products grid
function renderProducts() {
  if (!productsGrid) return;
  
  productsGrid.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-text-secondary);">No products found</div>';
    return;
  }

  filteredProducts.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });

  // Add fade-in animation
  const cards = productsGrid.querySelectorAll('.product-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('fade-in');
    }, index * 50);
  });
}

// Create product card element
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="product-card__image">
      <i class="${product.icon}"></i>
      <div class="product-card__discount">${product.discount}</div>
      <button class="product-card__wishlist" data-product-id="${product.id}">
        <i class="fas fa-heart ${wishlist.includes(product.id) ? 'wished' : ''}"></i>
      </button>
    </div>
    <div class="product-card__content">
      <div class="product-card__category">${product.subcategory}</div>
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__rating">
        <div class="rating-stars">${generateStars(product.rating)}</div>
        <span class="rating-text">${product.rating} (${product.reviews})</span>
      </div>
      <div class="product-card__price">
        <span class="price">₹${product.price.toLocaleString()}</span>
        <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
      </div>
      <div class="product-card__actions">
        <button class="btn btn--secondary btn--sm quick-view-btn" data-product-id="${product.id}">
          <i class="fas fa-eye"></i> Quick View
        </button>
        <button class="btn btn--primary btn--sm add-to-cart-btn" data-product-id="${product.id}">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  `;

  return card;
}

// Generate star rating
function generateStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('<i class="fas fa-star"></i>');
  }
  
  if (hasHalfStar) {
    stars.push('<i class="fas fa-star-half-alt"></i>');
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push('<i class="far fa-star"></i>');
  }
  
  return stars.join('');
}

// Filter products
function filterProducts() {
  let filtered = [...allProducts];

  // Filter by category
  if (currentCategory !== 'all') {
    filtered = filtered.filter(product => {
      if (currentCategory === 'smartwatches') {
        return product.category === 'Smart Watches';
      } else if (currentCategory === 'earbuds') {
        return product.category === 'Earbuds';
      } else if (currentCategory === 'accessories') {
        return product.category === 'Accessories';
      }
      return true;
    });
  }

  // Filter by search
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
  if (searchTerm) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.subcategory.toLowerCase().includes(searchTerm) ||
      product.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }

  // Sort products
  sortProducts(filtered);
  
  filteredProducts = filtered;
  renderProducts();
}

// Sort products
function sortProducts(products) {
  switch (currentSort) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      products.sort((a, b) => a.id - b.id);
      break;
  }
}

// Add to cart
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCartUI();
  saveCartToStorage();
  showNotification(`${product.name} added to cart!`, 'success');
  
  // Show cart sidebar
  if (cartSidebar) {
    cartSidebar.classList.add('open');
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  saveCartToStorage();
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
      saveCartToStorage();
    }
  }
}

// Update cart UI
function updateCartUI() {
  if (!cartCount || !cartContent || !cartFooter || !cartTotal) return;
  
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Update cart content
  if (cart.length === 0) {
    cartContent.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
    cartFooter.style.display = 'none';
  } else {
    cartContent.innerHTML = cart.map(item => createCartItem(item)).join('');
    cartFooter.style.display = 'block';
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
  }
}

// Create cart item element
function createCartItem(item) {
  return `
    <div class="cart-item">
      <div class="cart-item__image">
        <i class="${item.icon}"></i>
      </div>
      <div class="cart-item__details">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">₹${item.price.toLocaleString()}</div>
        <div class="quantity-controls">
          <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
          <button class="btn btn--sm btn--accent remove-item-btn" data-product-id="${item.id}" style="margin-left: 10px;">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Toggle wishlist
function toggleWishlist(productId) {
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) return;

  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    showNotification(`${product.name} removed from wishlist`, 'info');
  } else {
    wishlist.push(productId);
    showNotification(`${product.name} added to wishlist!`, 'success');
  }

  // Update wishlist UI
  const wishlistBtn = document.getElementById('wishlistBtn');
  if (wishlistBtn) {
    const badge = wishlistBtn.querySelector('.badge');
    if (badge) {
      badge.textContent = wishlist.length;
    }
  }

  // Update product cards
  const heartIcons = document.querySelectorAll('.product-card__wishlist i');
  heartIcons.forEach(icon => {
    const button = icon.closest('.product-card__wishlist');
    const cardProductId = parseInt(button.dataset.productId);
    if (cardProductId === productId) {
      icon.className = `fas fa-heart ${wishlist.includes(productId) ? 'wished' : ''}`;
    }
  });

  saveWishlistToStorage();
}

// Open product modal
function openProductModal(productId) {
  const product = allProducts.find(p => p.id === productId);
  
  if (!product || !modalContent || !productModal) return;

  modalContent.innerHTML = `
    <div class="modal-product">
      <div class="modal-product__image">
        <i class="${product.icon}"></i>
      </div>
      <div class="modal-product__details">
        <div class="modal-product__category">${product.subcategory}</div>
        <h2>${product.name}</h2>
        <div class="product-card__rating">
          <div class="rating-stars">${generateStars(product.rating)}</div>
          <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
        </div>
        <div class="modal-product__price">
          <span class="price" style="font-size: 1.5rem;">₹${product.price.toLocaleString()}</span>
          <span class="original-price" style="font-size: 1.2rem;">₹${product.originalPrice.toLocaleString()}</span>
          <span class="status status--error">${product.discount}</span>
        </div>
        <div class="modal-product__features">
          <h4>Key Features</h4>
          <div class="features-list">
            ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
          </div>
        </div>
        <div class="modal-product__colors">
          <h4>Available Colors</h4>
          <div class="color-options">
            ${product.colors.map((color, index) => {
              const colorClass = color.toLowerCase().replace(' ', '-');
              return `<div class="color-option ${colorClass} ${index === 0 ? 'active' : ''}" 
                           style="background-color: ${getColorCode(color)}"
                           data-color="${color}"></div>`;
            }).join('')}
          </div>
        </div>
        <p style="margin: 20px 0; color: var(--color-text-secondary);">${product.description}</p>
        <div style="display: flex; gap: 15px; margin-top: 30px; flex-wrap: wrap;">
          <button class="btn btn--primary modal-add-to-cart" data-product-id="${product.id}">
            <i class="fas fa-cart-plus"></i> Add to Cart - ₹${product.price.toLocaleString()}
          </button>
          <button class="btn btn--secondary modal-wishlist-btn" data-product-id="${product.id}">
            <i class="fas fa-heart ${wishlist.includes(product.id) ? 'wished' : ''}"></i> 
            ${wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  `;

  productModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
  if (!productModal) return;
  
  productModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Get color code for color options
function getColorCode(color) {
  const colorMap = {
    'black': '#000000',
    'white': '#ffffff',
    'silver': '#c0c0c0',
    'rose gold': '#e8b4a4',
    'blue': '#007bff',
    'green': '#28a745',
    'red': '#dc3545',
    'brown': '#8b4513'
  };
  return colorMap[color.toLowerCase()] || '#cccccc';
}

// Initialize hero slider
function initializeHeroSlider() {
  if (!heroSlider) return;
  
  const slides = heroSlider.querySelectorAll('.hero__slide');
  const navBtns = document.querySelectorAll('.hero__nav-btn');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    if (slides[index] && navBtns[index]) {
      slides[index].classList.add('active');
      navBtns[index].classList.add('active');
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Auto-advance slides
  setInterval(nextSlide, 5000);

  // Navigation button listeners
  navBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });
}

// Initialize event listeners
function initializeEventListeners() {
  // Cart sidebar
  if (cartBtn && cartSidebar) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartSidebar.classList.add('open');
    });
  }

  if (closeSidebar && cartSidebar) {
    closeSidebar.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
    });
  }

  // Close modal
  if (closeModal) {
    closeModal.addEventListener('click', closeProductModal);
  }
  
  if (productModal) {
    productModal.addEventListener('click', (e) => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  // Filters
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      filterProducts();
    });
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      currentSort = e.target.value;
      filterProducts();
    });
  }

  // Search
  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      filterProducts();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filterProducts();
      }
    });
    
    // Real-time search
    searchInput.addEventListener('input', () => {
      filterProducts();
    });
  }

  // Category cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (categoryFilter) {
        categoryFilter.value = category;
      }
      currentCategory = category;
      filterProducts();
      
      // Scroll to products section
      const productsSection = document.querySelector('.products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mobile menu
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('mobile-open');
    });
  }

  // Product card interactions using event delegation
  document.addEventListener('click', function(e) {
    // Quick View
    if (e.target.closest('.quick-view-btn')) {
      const productId = parseInt(e.target.closest('.quick-view-btn').dataset.productId);
      openProductModal(productId);
    }
    
    // Add to Cart
    if (e.target.closest('.add-to-cart-btn')) {
      const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.productId);
      addToCart(productId);
    }
    
    // Wishlist
    if (e.target.closest('.product-card__wishlist')) {
      const productId = parseInt(e.target.closest('.product-card__wishlist').dataset.productId);
      toggleWishlist(productId);
    }
    
    // Cart quantity controls
    if (e.target.closest('.quantity-btn')) {
      const btn = e.target.closest('.quantity-btn');
      const productId = parseInt(btn.dataset.productId);
      const action = btn.dataset.action;
      
      if (action === 'increase') {
        updateQuantity(productId, 1);
      } else if (action === 'decrease') {
        updateQuantity(productId, -1);
      }
    }
    
    // Remove item from cart
    if (e.target.closest('.remove-item-btn')) {
      const productId = parseInt(e.target.closest('.remove-item-btn').dataset.productId);
      removeFromCart(productId);
    }
    
    // Modal interactions
    if (e.target.closest('.modal-add-to-cart')) {
      const productId = parseInt(e.target.closest('.modal-add-to-cart').dataset.productId);
      addToCart(productId);
      closeProductModal();
    }
    
    if (e.target.closest('.modal-wishlist-btn')) {
      const productId = parseInt(e.target.closest('.modal-wishlist-btn').dataset.productId);
      toggleWishlist(productId);
      // Update modal button
      const btn = e.target.closest('.modal-wishlist-btn');
      const icon = btn.querySelector('i');
      const isWished = wishlist.includes(productId);
      icon.className = `fas fa-heart ${isWished ? 'wished' : ''}`;
      btn.innerHTML = `<i class="fas fa-heart ${isWished ? 'wished' : ''}"></i> ${isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}`;
    }
    
    // Color selection in modal
    if (e.target.closest('.color-option')) {
      const colorOptions = e.target.closest('.color-options').querySelectorAll('.color-option');
      colorOptions.forEach(option => option.classList.remove('active'));
      e.target.closest('.color-option').classList.add('active');
    }
  });

  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      if (email) {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.querySelector('input[type="email"]').value = '';
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mainNav && mobileMenuBtn && !mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      mainNav.classList.remove('mobile-open');
    }
  });
}

// Storage functions
function saveCartToStorage() {
  try {
    localStorage.setItem('trandloft_cart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Could not save cart to localStorage:', e);
  }
}

function loadCartFromStorage() {
  try {
    const savedCart = localStorage.getItem('trandloft_cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  } catch (e) {
    console.warn('Could not load cart from localStorage:', e);
    cart = [];
  }
}

function saveWishlistToStorage() {
  try {
    localStorage.setItem('trandloft_wishlist', JSON.stringify(wishlist));
  } catch (e) {
    console.warn('Could not save wishlist to localStorage:', e);
  }
}

function loadWishlistFromStorage() {
  try {
    const savedWishlist = localStorage.getItem('trandloft_wishlist');
    if (savedWishlist) {
      wishlist = JSON.parse(savedWishlist);
      const wishlistBtn = document.getElementById('wishlistBtn');
      if (wishlistBtn) {
        const badge = wishlistBtn.querySelector('.badge');
        if (badge) {
          badge.textContent = wishlist.length;
        }
      }
    }
  } catch (e) {
    console.warn('Could not load wishlist from localStorage:', e);
    wishlist = [];
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    color: var(--color-text);
    padding: 15px 20px;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    border-left: 4px solid ${getNotificationColor(type)};
    max-width: 300px;
  `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Auto remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function getNotificationIcon(type) {
  const icons = {
    'success': 'fa-check-circle',
    'error': 'fa-exclamation-triangle',
    'warning': 'fa-exclamation-circle',
    'info': 'fa-info-circle'
  };
  return icons[type] || icons.info;
}

function getNotificationColor(type) {
  const colors = {
    'success': 'var(--color-success)',
    'error': 'var(--color-error)',
    'warning': 'var(--color-warning)',
    'info': 'var(--color-primary)'
  };
  return colors[type] || colors.info;
}