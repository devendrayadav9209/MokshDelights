// ===========================
// CART SYSTEM
// Handles cart operations and localStorage
// ===========================

// Track selected sizes for products
const selectedSizes = {};

// Handle size selection
function selectSize(element, productName, weight, price) {
    // Remove active class from siblings
    const siblings = element.parentElement.querySelectorAll('.size-option');
    siblings.forEach(sibling => sibling.classList.remove('active'));
    
    // Add active class to clicked element
    element.classList.add('active');
    
    // Store selected size
    selectedSizes[productName] = {
        weight: weight,
        price: price
    };
    
    // Update displayed price
    const priceElement = document.getElementById(`price-${productName}`);
    if (priceElement) {
        priceElement.textContent = `₹${price}`;
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSelectedSizes();
    updateCartDisplay();
    initializeCheckout();
    updateNavigation();
    initializeAddressSection();
});

// Initialize selected sizes from active product size options
function initializeSelectedSizes() {
    const sizeOptions = document.querySelectorAll('.size-option.active');
    sizeOptions.forEach(option => {
        // Get the onclick attribute and parse it
        const onclickStr = option.getAttribute('onclick');
        if (onclickStr) {
            // Extract values from: selectSize(this, 'Product Name', weight, price)
            const match = onclickStr.match(/selectSize\(this,\s*'([^']+)',\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const productName = match[1];
                const weight = parseInt(match[2]);
                const price = parseInt(match[3]);
                selectedSizes[productName] = { weight, price };
            }
        }
    });
}

// Add item to cart
function addToCart(productName) {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        showLoginPrompt();
        return;
    }
    
    // Get selected size or default to 1kg
    const sizeInfo = selectedSizes[productName] || { weight: 1000, price: getProductPrice(productName) };
    
    const cart = getCart();
    const itemKey = `${productName}-${sizeInfo.weight}gm`;
    const existingItem = cart.find(item => item.key === itemKey);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            key: itemKey,
            name: productName,
            weight: sizeInfo.weight,
            quantity: 1,
            price: sizeInfo.price
        });
    }
    
    saveCart(cart);
    updateCartDisplay();
    updateNavigation();
    
    // Show feedback
    showAddToCartNotification(`${productName} (${sizeInfo.weight}gm) added to cart`);
}

// Get product price
function getProductPrice(productName) {
    const priceMap = {
        'Prawn Pickle': 350,
        'Dried Bombay Duck Pickle': 280,
        'Coriander Powder': 300,
        'Turmeric Powder': 360,
        'Kashmiri Chilli Powder': 440,
        'Chilli Powder': 440,
        'Meat Masala': 440,
        'Fish Masala': 440,
        'Garam Masala': 460,
        'Chicken Curry Masala': 440,
        'Fish Curry Masala': 440,
        'Mutton Masala': 440,
        'Pav Bhaji Masala': 440,
        'Kitchen King Masala': 440,
        'Tandoori Masala': 440,
        'Sambhar Masala': 440,
        'Ghati Masala': 440
    };
    return priceMap[productName] || 0;
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('moksh_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('moksh_cart', JSON.stringify(cart));
}

// Remove item from cart
function removeFromCart(itemKey) {
    let cart = getCart();
    cart = cart.filter(item => item.key !== itemKey);
    saveCart(cart);
    updateCartDisplay();
    updateNavigation();
    updateCheckoutButton();
}

// Update item quantity
function updateQuantity(itemKey, quantity) {
    if (quantity < 1) {
        removeFromCart(itemKey);
        return;
    }
    
    const cart = getCart();
    const item = cart.find(item => item.key === itemKey);
    
    if (item) {
        item.quantity = parseInt(quantity);
        saveCart(cart);
        updateCartDisplay();
        updateNavigation();
        updateCheckoutButton();
    }
}

// Calculate cart totals
function getCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
        subtotal: subtotal,
        total: total,
        totalItems: totalItems
    };
}

// Update cart display on cart page
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    
    if (!cartItemsContainer) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsContainer.style.display = 'none';
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        updateSummary();
        updateCheckoutButton();
        return;
    }
    
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name} <span style="color: #666; font-size: 0.9rem; font-weight: normal;">(${item.weight}gm)</span></h3>
                <p class="item-price">₹${item.price.toLocaleString('en-IN')}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateQuantity('${item.key}', ${item.quantity - 1})">−</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.key}', this.value)" class="qty-input">
                    <button class="qty-btn" onclick="updateQuantity('${item.key}', ${item.quantity + 1})">+</button>
                </div>
                <p class="item-total">₹${(item.price * item.quantity).toLocaleString('en-IN')}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.key}')" title="Remove item">✕</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    updateSummary();
}

// Update summary section
function updateSummary() {
    const totals = getCartTotals();
    
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total-amount');
    const itemsCountEl = document.getElementById('total-items-count');
    
    if (subtotalEl) subtotalEl.textContent = '₹' + totals.subtotal.toLocaleString('en-IN');
    if (totalEl) totalEl.textContent = '₹' + Math.round(totals.total).toLocaleString('en-IN');
    if (itemsCountEl) itemsCountEl.textContent = totals.totalItems;
    
    // Update checkout button visibility
    updateCheckoutButton();
}

// Update checkout button visibility
function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutMessage = document.getElementById('checkout-message');
    const cart = getCart();
    const isLoggedIn = isUserLoggedIn();
    
    if (!checkoutBtn) {
        console.log('Checkout button not found');
        return;
    }
    
    console.log('Checkout button update - Logged in:', isLoggedIn, 'Cart items:', cart.length);
    
    if (isLoggedIn && cart.length > 0) {
        checkoutBtn.style.display = 'block';
        if (checkoutMessage) checkoutMessage.style.display = 'none';
        updateAddressSection();
        console.log('Showing checkout button');
    } else if (!isLoggedIn && cart.length > 0) {
        checkoutBtn.style.display = 'none';
        if (checkoutMessage) checkoutMessage.style.display = 'block';
        updateAddressSection();
        console.log('Showing login message - not logged in');
    } else {
        checkoutBtn.style.display = 'none';
        if (checkoutMessage) checkoutMessage.style.display = 'none';
        updateAddressSection();
        console.log('Hiding checkout button - no cart items');
    }
}

// Initialize checkout button
function initializeCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!checkoutBtn) return;
    
    // Remove any existing listeners by replacing the element
    const newBtn = checkoutBtn.cloneNode(true);
    checkoutBtn.parentNode.replaceChild(newBtn, checkoutBtn);
    
    // Add fresh click listener to the new button
    const freshBtn = document.getElementById('checkout-btn');
    if (freshBtn) {
        freshBtn.addEventListener('click', function(e) {
            e.preventDefault();
            proceedToWhatsApp();
        });
    }
    
    // Initial state
    updateCheckoutButton();
}

// Initialize address section
function initializeAddressSection() {
    const addressSection = document.getElementById('address-section');
    if (!addressSection) return;
    
    // Load saved address from localStorage
    loadAddressData();
    
    // Show/hide address section based on cart
    updateAddressSection();
}

// Save address data to localStorage
function saveAddressData() {
    const address = {
        fullName: document.getElementById('address-full-name').value,
        phone: document.getElementById('address-phone').value,
        street: document.getElementById('address-street').value,
        city: document.getElementById('address-city').value,
        state: document.getElementById('address-state').value,
        zip: document.getElementById('address-zip').value,
        notes: document.getElementById('address-notes').value
    };
    localStorage.setItem('moksh_delivery_address', JSON.stringify(address));
}

// Load address data from localStorage
function loadAddressData() {
    const saved = localStorage.getItem('moksh_delivery_address');
    if (saved) {
        const address = JSON.parse(saved);
        document.getElementById('address-full-name').value = address.fullName || '';
        document.getElementById('address-phone').value = address.phone || '';
        document.getElementById('address-street').value = address.street || '';
        document.getElementById('address-city').value = address.city || '';
        document.getElementById('address-state').value = address.state || '';
        document.getElementById('address-zip').value = address.zip || '';
        document.getElementById('address-notes').value = address.notes || '';
    }
    
    // Add change listeners to save automatically
    const addressFields = ['address-full-name', 'address-phone', 'address-street', 'address-city', 'address-state', 'address-zip', 'address-notes'];
    addressFields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.addEventListener('change', saveAddressData);
            field.addEventListener('blur', saveAddressData);
        }
    });
}

// Get address data
function getAddressData() {
    return {
        fullName: document.getElementById('address-full-name').value,
        phone: document.getElementById('address-phone').value,
        street: document.getElementById('address-street').value,
        city: document.getElementById('address-city').value,
        state: document.getElementById('address-state').value,
        zip: document.getElementById('address-zip').value,
        notes: document.getElementById('address-notes').value
    };
}

// Update address section visibility
function updateAddressSection() {
    const addressSection = document.getElementById('address-section');
    const cart = getCart();
    
    if (!addressSection) return;
    
    if (cart.length > 0 && isUserLoggedIn()) {
        addressSection.style.display = 'block';
    } else {
        addressSection.style.display = 'none';
    }
}

// Proceed to WhatsApp checkout
function proceedToWhatsApp() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    // Validate address fields
    const address = getAddressData();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.zip) {
        alert('Please fill in all required address fields before checkout');
        return;
    }
    
    const user = getCurrentUser();
    const totals = getCartTotals();
    
    // Build product list with weight/grams
    let productList = '';
    cart.forEach((item, index) => {
        productList += `${index + 1}. ${item.name} (${item.weight}gm) - Qty: ${item.quantity} x ₹${item.price.toLocaleString('en-IN')} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}\n`;
    });
    
    // Create WhatsApp message
    const message = `Hello! I would like to place an order from Moksh Delights.

*Customer Details:*
Name: ${user.fullName}
Email: ${user.email}

*Delivery Address:*
${address.fullName}
${address.street}
${address.city}, ${address.state} ${address.zip}
Phone: ${address.phone}
${address.notes ? `\nDelivery Notes: ${address.notes}` : ''}

*Order Details:*
${productList}
*Total: ₹${Math.round(totals.total).toLocaleString('en-IN')}*

Please confirm availability and delivery charges.`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/917738772241?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after checkout
    setTimeout(() => {
        saveCart([]);
        updateCartDisplay();
        updateNavigation();
        alert('Order sent! The seller will contact you soon.');
    }, 1000);
}

// Update navigation (cart count and login/logout buttons)
function updateNavigation() {
    const cartCount = document.getElementById('cart-count');
    const authNavItem = document.getElementById('auth-nav-item');
    const totals = getCartTotals();
    
    // Update cart badge
    if (cartCount) {
        if (totals.totalItems > 0) {
            cartCount.style.display = 'inline-block';
            cartCount.textContent = totals.totalItems;
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    // Update auth nav item
    if (authNavItem) {
        const isInPages = window.location.pathname.split('/').includes('pages');
        const authHref = isInPages ? 'auth.html' : 'pages/auth.html';

        if (isUserLoggedIn()) {
            const user = getCurrentUser();
            authNavItem.innerHTML = `<a href="#" onclick="logout(event)">👤 ${user.fullName.split(' ')[0]} (Logout)</a>`;
        } else {
            authNavItem.innerHTML = `<a href="${authHref}">🔐 Login</a>`;
        }
    }
}

// Show login prompt
function showLoginPrompt() {
    alert('Please login to add items to cart!\n\nYou will be redirected to the login page.');
    const isInPages = window.location.pathname.split('/').includes('pages');
    const authHref = isInPages ? 'auth.html' : 'pages/auth.html';
    window.location.href = authHref;
}

// Show add to cart notification
function showAddToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `✓ "${productName}" added to cart!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Prevent logout event propagation
function logout(e) {
    if (e) e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('moksh_currentUser');
        const isInPages = window.location.pathname.split('/').includes('pages');
        window.location.href = isInPages ? '../index.html' : 'index.html';
    }
}
