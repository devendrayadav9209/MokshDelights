# System Architecture Overview

## 🎯 Complete Feature Implementation

### Authentication System Flow

```
┌─────────────────┐
│   Login Page    │
│   (auth.html)   │
└────────┬────────┘
         │
         ├─────────────┬──────────────┐
         │             │              │
    Existing?      New User?   Invalid Input?
         │             │              │
         ✓             ✓              ✗
         │             │              │
    ┌────┴─┐      ┌────┴─┐      ┌────┴────┐
    │ Login│      │Signup│      │  Error  │
    └────┬─┘      └────┬─┘      │ Message │
         │             │         └────────┘
         └──────┬──────┘
                │
         ┌──────┴──────┐
         │ localStorage│
         │ mkosh_users │
         └──────┬──────┘
                │
         ┌──────┴────────────┐
         │  Redirect to      │
         │  products.html    │
         │  (Auto-logged in) │
         └───────────────────┘
```

### Cart System Flow

```
┌──────────────────────────────────────┐
│      Products Page (products.html)    │
│                                       │
│  [Add to Cart] [Add to Cart] ...      │
└────────────────┬─────────────────────┘
                 │
        Is User Logged In?
         │              │
         YES            NO
         │              │
    ┌────▼──┐      ┌────▼──────┐
    │ Add   │      │ Show Login │
    │ Item  │      │ Prompt &   │
    │ to    │      │ Redirect   │
    │localStorage  │ to auth.html
    └────┬──┘      └──────────┘
         │
         ├─────────────────┐
         │                 │
    UPDATE CART     UPDATE NAV
    DISPLAY         (badge + user)
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   Cart Page     │
         │  (cart.html)    │
         │                 │
         │ • View Items    │
         │ • Edit Quantity │
         │ • Remove Items  │
         │ • View Totals   │
         │ • Checkout      │
         └────────┬────────┘
                  │
         ┌────────▼────────────┐
         │ Generate WhatsApp   │
         │ Message with:       │
         │ • User Name & Email │
         │ • Product List      │
         │ • Prices & Qty      │
         │ • Tax & Total       │
         └────────┬────────────┘
                  │
         ┌────────▼────────────┐
         │ Open wa.me Link     │
         │ Clear Cart          │
         └─────────────────────┘
```

### Data Flow in localStorage

```
User Registration:
┌────────────────────────────────────────────┐
│ User fills signup form                      │
│ Validates: name, email, password           │
│ Stores in moksh_users object               │
│ Sets moksh_currentUser (auto-login)        │
└────────────────────────────────────────────┘

User Login:
┌────────────────────────────────────────────┐
│ User enters email & password               │
│ Checks moksh_users object                  │
│ Sets moksh_currentUser if valid            │
└────────────────────────────────────────────┘

Add to Cart:
┌────────────────────────────────────────────┐
│ Check if moksh_currentUser exists          │
│ If YES: retrieve moksh_cart array          │
│         add/update item                    │
│         save back to localStorage          │
│ If NO: redirect to auth.html               │
└────────────────────────────────────────────┘

Calculate Total:
┌────────────────────────────────────────────┐
│ Read moksh_cart array                      │
│ For each item: price × quantity = subtotal │

│ total = subtotal + tax                     │
│ totalItems = sum of all quantities         │
└────────────────────────────────────────────┘
```

## 📊 Database Structure (localStorage)

### Users Collection
```javascript
{
  "email@example.com": {
    fullName: "John Doe",
    email: "email@example.com",
    password: "password123",        // In production: hash this!
    signupDate: "2026-02-01T00:00:00.000Z"
  },
  "another@example.com": {
    fullName: "Jane Smith",
    email: "another@example.com",
    password: "securepass456",
    signupDate: "2026-02-01T10:30:00.000Z"
  }
}
```

### Current User Session
```javascript
{
  email: "email@example.com",
  fullName: "John Doe",
  loginTime: 1707273600000      // Timestamp in milliseconds
}
```

### Shopping Cart
```javascript
[
  {
    name: "Prawn Pickle",
    quantity: 2,
    price: 350
  },
  {
    name: "Red Chilli Powder",
    quantity: 1,
    price: 125
  },
  {
    name: "Turmeric Powder",
    quantity: 3,
    price: 90
  }
]
```

## 🔗 Navigation Structure

```
Header Navigation (All Pages):
├── 🏠 Home (index.html)
├── ℹ️  About Us (pages/about.html)
├── 📦 Products (pages/products.html)
├── 📞 Contact Us (pages/contact.html)
├── 🛒 Cart (pages/cart.html)
│   └── Shows [0] badge when empty
│   └── Shows [N] badge with item count
└── 🔐 Login (pages/auth.html)
    └── Changes to "👤 John Doe (Logout)" when logged in
```

## 🎨 Page Structure

### auth.html (Login/Signup)
```
Header (with nav)
  │
  └─ Auth Container
      ├─ Login Form (initial view)
      │  ├─ Email input
      │  ├─ Password input
      │  ├─ Login button
      │  └─ "Sign up here" link
      │
      └─ Signup Form (hidden, toggles)
         ├─ Name input
         ├─ Email input
         ├─ Password input
         ├─ Confirm Password input
         ├─ Create Account button
         └─ "Login here" link

Footer
```

### products.html (with Cart Added)
```
Header (with Cart badge & Login button)
  │
  └─ Hero Section
      ├─ Title
      └─ Subtitle
  │
  └─ Products Section
      ├─ Section Title
      ├─ Products Grid
      │  ├─ Product 1 Card
      │  │  ├─ Image
      │  │  ├─ Name
      │  │  ├─ Description
      │  │  ├─ Price
      │  │  └─ [Add to Cart] Button ◄─── Requires Login
      │  ├─ Product 2 Card
      │  └─ ... more products
      │
Footer
```

### cart.html (New Shopping Cart)
```
Header (with Cart badge "highlighted")
  │
  └─ Hero Section (Cart Title)
      │
  ├─ Cart Items Section      │  Order Summary Section
  │  │                       │  │
  │  ├─ Item 1               │  ├─ Subtotal: ₹1000
  │  │  ├─ Name              │  │
  │  │  ├─ Price             │  ├─ Tax (18%): ₹180
  │  │  ├─ Qty: [−] 2 [+]   │  │
  │  │  ├─ Total             │  ├─ ─────────────────
  │  │  └─ [✕] Remove        │  │ Total: ₹1180
  │  │                       │  │
  │  ├─ Item 2               │  ├─ Total Items: 3
  │  │  ...                  │  │
  │  │                       │  ├─ [Buy Now] Button
  │  ├─ Item N               │  │
  │  │  ...                  │  └─ [Continue Shop.] Link
  │  │                       │
  │  └─ [Continue Shop.]     │
  │                          │
  └─ (Empty State)
     ├─ "Your cart is empty"
     └─ [Continue Shopping]

Footer
```

## 🔐 Security Checklist

- ✅ Password minimum 6 characters
- ✅ Email validation with regex
- ✅ Check if user already exists on signup
- ✅ Check credentials on login
- ✅ Require login before cart operations
- ✅ Logout clears session
- ⚠️  TODO: Password hashing (backend required)
- ⚠️  TODO: HTTPS encryption (hosting required)
- ⚠️  TODO: Email verification (backend required)
- ⚠️  TODO: Password reset (backend required)

## 📱 Responsive Breakpoints

```
Desktop (> 1200px)
│
├─ Full width layout
├─ 2 column cart (items + summary side-by-side)
├─ Large product grid
└─ Hamburger menu hidden

Tablet (768px - 1200px)
│
├─ Adjusted grid columns
├─ Hamburger menu shown
├─ Stacked layout for some sections
└─ Floating buttons on side

Mobile (< 768px)
│
├─ Single column layout
├─ Cart summary under items
├─ Hamburger menu active
├─ Touch-friendly button sizes
└─ Full-width inputs
```

## 🚀 Performance Optimizations

- ✅ localStorage for instant data access
- ✅ No external API calls needed
- ✅ Lightweight JavaScript (no jQuery)
- ✅ CSS Grid for responsive layouts
- ✅ Minimal animations (smooth 0.3s transitions)
- ✅ Event delegation for dynamic content
- ✅ Sticky header for easy navigation
- ✅ Badge counts update in real-time

## 🔄 User Session Lifecycle

```
1. New Visit
   └─ Check localStorage for moksh_currentUser
      ├─ Found → Auto-logged in
      └─ Not Found → Show login button

2. Signup
   └─ Validate inputs
      └─ Store in moksh_users
         └─ Set moksh_currentUser
            └─ Redirect to products.html

3. Login
   └─ Validate inputs
      └─ Check moksh_users
         └─ Set moksh_currentUser
            └─ Redirect to products.html

4. Add to Cart (During Session)
   └─ Check if moksh_currentUser exists
      └─ Update moksh_cart
         └─ Update UI

5. Checkout
   └─ Read cart data
      └─ Generate message
         └─ Open WhatsApp
            └─ Clear moksh_cart
               └─ Update UI

6. Logout
   └─ Remove moksh_currentUser
      └─ Keep moksh_cart (for next login)
         └─ Redirect home
```

---

**Last Updated:** February 1, 2026
**Version:** 1.0 Complete
