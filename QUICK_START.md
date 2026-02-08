# Quick Start Guide

## Testing the System Locally

### Step 1: Open in Browser
Open any of these files in your web browser:
- `index.html` - Home page (with cart and login links)
- `pages/products.html` - Products page (with Add to Cart buttons)
- `pages/auth.html` - Login/Signup page
- `pages/cart.html` - Shopping cart page

### Step 2: Create an Account
1. Click "🔐 Login" in top navigation
2. Click "Sign up here"
3. Fill in the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm: `password123`
4. Click "Create Account"

### Step 3: Add Items to Cart
1. You're now on Products page and logged in
2. Click "Add to Cart" on any product
3. See notification: "✓ 'Product Name' added to cart!"
4. Notice cart badge shows number of items

### Step 4: View and Manage Cart
1. Click "🛒 Cart" in navigation
2. See all items with prices and quantities
3. Try these actions:
   - Click `+` to increase quantity
   - Click `-` to decrease quantity
   - Click `✕` to remove item
   - Change number and press Enter

### Step 5: Checkout
1. Ensure you're logged in (your name visible in header)
2. Have items in cart
3. Click "Buy Now on WhatsApp"
4. WhatsApp opens with pre-filled order message
5. Cart clears after checkout

### Step 6: Logout
1. Click your name in top right (where login was)
2. Confirm logout
3. You're logged out, back to home page

---

## Testing Scenarios

### Scenario 1: New User Registration
✅ Expected: All fields validated, account created, auto-logged in

### Scenario 2: Existing User Login
✅ Expected: Can login with credentials, redirected to products

### Scenario 3: Multiple Accounts
✅ Expected: Can signup multiple accounts, each has own cart

### Scenario 4: Cart Persistence
✅ Expected: Cart stays during session, clears only after WhatsApp checkout

### Scenario 5: Non-Logged User Adds Item
✅ Expected: Shown "Please login" alert, redirected to auth page

### Scenario 6: Quantity Management
✅ Expected: +/- buttons and direct input both work, totals update

### Scenario 7: WhatsApp Message
✅ Expected: Message includes name, email, products, prices, tax, total

---

## Files Created/Modified

### ✅ NEW FILES
- `pages/auth.html` - Authentication page
- `pages/cart.html` - Cart page
- `js/auth.js` - Auth logic (450+ lines)
- `js/cart.js` - Cart logic (400+ lines)
- `AUTHENTICATION_CART_GUIDE.md` - Full documentation

### 📝 MODIFIED FILES
- `index.html` - Added auth/cart nav links
- `pages/products.html` - Updated header nav and scripts
- `css/styles.css` - Added 350+ lines of new styles

---

## Browser DevTools Tips

### Check localStorage
1. Open DevTools: Press F12
2. Go to "Application" tab
3. Click "localStorage" in left sidebar
4. See: `moksh_users`, `moksh_currentUser`, `moksh_cart`

### Monitor Events
1. Add console logs in cart.js functions
2. Check Console tab for output
3. Example: `console.log(getCurrentUser())`

### Debug Cart Issues
```javascript
// Open console and run these:
localStorage.getItem('moksh_cart')        // View cart
localStorage.getItem('moksh_currentUser') // View logged-in user
localStorage.getItem('moksh_users')       // View all users
```

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Add to Cart" doesn't work | Make sure you're logged in (check header) |
| Cart shows wrong totals | Refresh page (F5) |
| Can't login after signup | Check email spelling |
| Lost login session | localStorage was cleared, signup again |
| WhatsApp doesn't open | Ensure cart has items and you're logged in |

---

## Feature Checklist

- ✅ User Registration
- ✅ User Login
- ✅ User Logout
- ✅ Email Validation
- ✅ Password Validation
- ✅ Session Persistence
- ✅ Add to Cart
- ✅ Remove from Cart
- ✅ Update Quantity
- ✅ Calculate Totals

- ✅ WhatsApp Checkout
- ✅ Cart Badge
- ✅ Login Required Check
- ✅ Responsive Design
- ✅ Mobile Menu

---

## Next Steps

1. **Test Thoroughly**
   - Try all sign up/login combinations
   - Test cart with multiple items
   - Check WhatsApp message format

2. **Customize**
   - Change product names and prices in cart.js
   - Customize WhatsApp message in proceedToWhatsApp()
   - Adjust colors in styles.css using CSS variables

3. **Deploy**
   - Upload files to web server
   - Test on live domain
   - Share link with users

4. **Enhance (Optional)**
   - Add email verification
   - Implement password reset
   - Add order history
   - Include payment gateway
   - Add product images

---

**Ready to use! Happy selling! 🎉**
