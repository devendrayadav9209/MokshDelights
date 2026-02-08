# Login, Signup & Cart System - Implementation Guide

## ✨ Features Implemented

### 1. **Authentication System**
- ✅ Complete Login & Signup system
- ✅ Email validation
- ✅ Password validation (minimum 6 characters)
- ✅ User registration with full name
- ✅ Secure localStorage-based user management
- ✅ Persistent login sessions
- ✅ Logout functionality with confirmation

### 2. **Cart System**
- ✅ Add items to cart (requires login)
- ✅ Remove items from cart
- ✅ Update quantity with +/- buttons or direct input
- ✅ Calculate subtotal and total
- ✅ Display total items count
- ✅ Cart badge showing number of items in header
- ✅ Empty cart detection

### 3. **WhatsApp Integration**
- ✅ "Buy Now on WhatsApp" button
- ✅ Pre-filled message with:
  - Customer name and email
  - Product names and quantities
  - Prices and totals
  - Tax calculation
- ✅ Direct link to WhatsApp (wa.me)
- ✅ Auto-clears cart after checkout

### 4. **User Management**
- ✅ Only logged-in users can add to cart
- ✅ Login prompt when non-logged-in users try to add items
- ✅ Display user name in navigation when logged in
- ✅ Logout button appears in navigation for logged-in users
- ✅ Users stay logged in until they logout
- ✅ All user data stored in localStorage

## 📁 File Structure

```
MD/
├── pages/
│   ├── auth.html          (New - Login/Signup page)
│   ├── cart.html          (New - Shopping cart page)
│   ├── products.html      (Updated)
│   ├── about.html
│   ├── contact.html
│
├── js/
│   ├── main.js            (Existing)
│   ├── auth.js            (New - Authentication logic)
│   ├── cart.js            (New - Cart logic)
│
├── css/
│   └── styles.css         (Updated with new styles)
│
├── index.html             (Updated with nav links)
└── images/
```

## 🚀 How to Use

### For Users

#### **Sign Up (New Users)**
1. Go to the website and click "🔐 Login" in the navigation
2. Click "Sign up here" link
3. Fill in the signup form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
4. Click "Create Account"
5. You'll be automatically logged in and redirected to Products page

#### **Login (Existing Users)**
1. Click "🔐 Login" in the navigation
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to Products page

#### **Add Items to Cart**
1. Make sure you're logged in (check if your name appears in header)
2. Go to Products page
3. Click "Add to Cart" button on any product
4. You'll see a confirmation notification
5. Cart count badge will appear in header with number of items

#### **Manage Cart**
1. Click "🛒 Cart" in the navigation
2. View all items with prices
3. Adjust quantities using:
   - `-` button to decrease quantity
   - `+` button to increase quantity
   - Direct number input
4. Click `✕` button to remove an item
5. See real-time totals (Subtotal, Tax, Total)

#### **Checkout via WhatsApp**
1. Make sure you're logged in
2. Have items in your cart
3. Go to Cart page
4. Click "Buy Now on WhatsApp" button
5. This opens WhatsApp with a pre-filled message containing:
   - Your name and email
   - All product details
   - Quantities and prices
   - Total amount with tax
6. Seller will receive your order and confirm delivery details

#### **Logout**
1. Click on your name in the navigation (shows when logged in)
2. Confirm logout
3. You'll be logged out and redirected to home page

### For Developers

#### **localStorage Structure**

**User Data:**
```javascript
// All users stored in this object
localStorage.setItem('moksh_users', JSON.stringify({
  'email@example.com': {
    fullName: 'John Doe',
    email: 'email@example.com',
    password: 'hashedPassword',
    signupDate: '2026-02-01T00:00:00.000Z'
  }
}));

// Current logged-in user
localStorage.setItem('moksh_currentUser', JSON.stringify({
  email: 'email@example.com',
  fullName: 'John Doe',
  loginTime: 1707273600000
}));
```

**Cart Data:**
```javascript
localStorage.setItem('moksh_cart', JSON.stringify([
  {
    name: 'Product Name',
    quantity: 2,
    price: 350
  }
]));
```

#### **Key JavaScript Functions**

**Authentication (auth.js):**
```javascript
isUserLoggedIn()           // Returns true if user is logged in
getCurrentUser()           // Returns current user object
logout()                   // Logs out current user
isValidEmail(email)        // Validates email format
```

**Cart (cart.js):**
```javascript
addToCart(productName)     // Adds product to cart (checks login)
removeFromCart(productName) // Removes product from cart
updateQuantity(name, qty)  // Updates product quantity
getCart()                  // Gets cart array from localStorage
saveCart(cart)             // Saves cart to localStorage
getCartTotals()            // Returns {subtotal, tax, total, totalItems}
updateCartDisplay()        // Refreshes cart page display
updateNavigation()         // Updates cart count and user info in header
proceedToWhatsApp()        // Generates WhatsApp message and opens wa.me
```

#### **Adding New Products**

1. Add product button to products.html:
```html
<button class="btn-small" onclick="addToCart('Product Name')">Add to Cart</button>
```

2. Add price mapping in cart.js:
```javascript
const priceMap = {
  'Product Name': 100,
  // ... other products
};
```

#### **Customizing WhatsApp Message**

Edit the `proceedToWhatsApp()` function in cart.js to customize the WhatsApp message format.

## 🎨 Styling Classes

### Authentication Pages
- `.auth-section` - Main auth container wrapper
- `.auth-container` - Container for forms
- `.auth-form` - Form container (login/signup)
- `.auth-message` - Status messages
- `.auth-success` - Success message style
- `.auth-error` - Error message style

### Cart Pages
- `.cart-section` - Main cart section
- `.cart-container` - Grid container
- `.cart-item` - Individual cart item
- `.cart-summary` - Order summary box
- `.quantity-control` - Quantity buttons
- `.cart-badge` - Item count badge
- `.cart-notification` - Add to cart notification

## 🔒 Security Notes

**Important:** This implementation uses localStorage for demonstration purposes. For production:
- Use proper backend authentication (JWT, sessions, etc.)
- Hash passwords on the server
- Never store passwords in plain text
- Implement HTTPS
- Use secure database for user data

## 📱 Responsive Design

The system is fully responsive with breakpoints:
- **Desktop** (> 768px): Full layout
- **Tablet** (768px - 481px): Optimized grid
- **Mobile** (≤ 480px): Single column, adjusted spacing

## 🐛 Troubleshooting

**Issue: Can't add items to cart**
- Solution: Make sure you're logged in. Click "🔐 Login" and create/use an account

**Issue: Cart not showing items**
- Solution: Clear localStorage and try again. Open DevTools > Application > localStorage > Clear

**Issue: WhatsApp not opening**
- Solution: Make sure you're logged in and have items in cart. Check if cart count badge is visible

**Issue: Lost login session**
- Solution: User data is stored in browser's localStorage. Clearing cache will remove it

## 📞 Contact

For issues or questions about the implementation, contact Moksh Delights:
- WhatsApp: https://wa.me/917738772241
- Email: mokshdelights24@gmail.com
- Phone: +91 7738772241

---

**Created:** February 1, 2026
**Version:** 1.0
**Status:** Fully Functional
