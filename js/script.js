// Global error handler to catch unhandled errors
window.onerror = function (message, source, lineno, colno, error) {
  console.error(`Unhandled script error: ${message} at ${source}:${lineno}:${colno}`, error);
  alert(`A script error occurred: ${message}. Please check the console (F12) for details.`);
  return true;
};

// Log script loading
console.log('script.js loaded at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

// Initialize cart
let cart = [];
try {
  const storedCart = localStorage.getItem('cart');
  if (storedCart) {
    cart = JSON.parse(storedCart);
    console.log('Cart loaded from localStorage:', cart);
  } else {
    console.log('No cart data in localStorage, starting with empty cart');
    localStorage.setItem('cart', JSON.stringify(cart));
  }
} catch (error) {
  console.error('Error parsing cart from localStorage, resetting cart:', error);
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Cart data was corrupted and has been reset. Please try adding items again.');
}

// Add item to cart
function addToCart(productName, price, image) {
  try {
    if (!productName || typeof price !== 'number' || !image) {
      throw new Error('Invalid arguments for addToCart');
    }
    console.log(`Attempting to add: ${productName}, ₹${price}, ${image}`);
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
      existingItem.quantity += 1;
      console.log(`Incremented quantity for ${productName}: ${existingItem.quantity}`);
    } else {
      cart.push({ name: productName, price: price, quantity: 1, image: image });
      console.log(`Added new item: ${productName}`);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved to localStorage:', cart);
    alert(`${productName} added to cart!`);
  } catch (error) {
    console.error('Error in addToCart:', error);
    alert(`Failed to add item to cart: ${error.message}. Please try again.`);
  }
}

// Remove item from cart
function removeFromCart(productName) {
  try {
    if (!productName) {
      throw new Error('Product name is required for removeFromCart');
    }
    console.log(`Removing item: ${productName}`);
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart after removal:', cart);
    renderCart();
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    alert(`Failed to remove item: ${error.message}. Please try again.`);
  }
}

// Update item quantity
function updateQuantity(productName, quantity) {
  try {
    if (!productName || quantity === undefined) {
      throw new Error('Product name and quantity are required for updateQuantity');
    }
    console.log(`Updating quantity for ${productName} to ${quantity}`);
    quantity = parseInt(quantity);
    if (isNaN(quantity)) {
      console.warn(`Invalid quantity for ${productName}: ${quantity}`);
      renderCart(); // Re-render to reset the input field
      return;
    }
    const item = cart.find(item => item.name === productName);
    if (!item) {
      throw new Error(`Item not found in cart: ${productName}`);
    }
    if (quantity >= 1) {
      item.quantity = quantity;
      console.log(`Quantity updated for ${productName}: ${item.quantity}`);
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart after quantity update:', cart);
      renderCart();
    } else {
      console.log(`Quantity less than 1, removing ${productName}`);
      removeFromCart(productName);
    }
  } catch (error) {
    console.error('Error in updateQuantity:', error);
    alert(`Failed to update quantity: ${error.message}. Please try again.`);
  }
}

// Render cart items
function renderCart() {
  try {
    console.log('Rendering cart:', cart);
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    if (!cartItemsDiv || !cartTotalSpan) {
      console.warn('Cart elements not found on this page. Skipping renderCart.');
      return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      console.log('Cart is empty');
      cartItemsDiv.innerHTML = '<p class="text-center text-gray-600 col-span-4">Your cart is empty.</p>';
    } else {
      cart.forEach(item => {
        if (!item.price || !item.quantity) {
          throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
        }
        const subtotal = (item.price * item.quantity).toFixed(2);
        total += parseFloat(subtotal);
        console.log(`Rendering item: ${item.name}, Quantity: ${item.quantity}, Subtotal: ₹${subtotal}`);
        cartItemsDiv.innerHTML += `
          <div class="grid grid-cols-4 gap-4 items-center">
            <div class="flex items-center">
              <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-4">
              <span>${item.name}</span>
            </div>
            <div>₹${item.price.toFixed(2)}</div>
            <div class="flex items-center space-x-2">
              <input type="number" value="${item.quantity}" min="1" class="w-16 p-2 border rounded" onchange="updateQuantity('${item.name}', this.value)">
              <button class="text-red-500 hover:text-red-700 text-xl" onclick="removeFromCart('${item.name}')">×</button>
            </div>
            <div>₹${subtotal}</div>
          </div>
        `;
      });
    }

    cartTotalSpan.textContent = `₹${total.toFixed(2)}`;
    console.log('Total calculated: ₹', total);
  } catch (error) {
    console.error('Error in renderCart:', error);
    alert(`Failed to render cart: ${error.message}. Please refresh the page.`);
  }
}

// Apply coupon (placeholder)
function applyCoupon() {
  try {
    const couponCodeElement = document.getElementById('coupon-code');
    if (!couponCodeElement) {
      throw new Error('Coupon code input not found');
    }
    const couponCode = couponCodeElement.value;
    console.log(`Applying coupon: ${couponCode}`);
    alert('Coupon functionality not implemented yet.');
  } catch (error) {
    console.error('Error in applyCoupon:', error);
    alert(`Failed to apply coupon: ${error.message}. Please try again.`);
  }
}

// Update cart (refresh rendering)
function updateCart() {
  try {
    console.log('Updating cart');
    renderCart();
    alert('Cart updated!');
  } catch (error) {
    console.error('Error in updateCart:', error);
    alert(`Failed to update cart: ${error.message}. Please try again.`);
  }
}

// Render order summary for checkout
function renderOrderSummary() {
  try {
    console.log('Rendering order summary:', cart);
    const orderSummaryDiv = document.getElementById('order-summary');
    const orderTotalSpan = document.getElementById('order-total');
    if (!orderSummaryDiv || !orderTotalSpan) {
      console.warn('Order summary elements not found on this page. Skipping renderOrderSummary.');
      return;
    }

    orderSummaryDiv.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      if (!item.price || !item.quantity) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }
      const subtotal = (item.price * item.quantity).toFixed(2);
      total += parseFloat(subtotal);
      console.log(`Order summary item: ${item.name}, Subtotal: ₹${subtotal}`);
      orderSummaryDiv.innerHTML += `
        <div class="flex justify-between">
          <p>${item.name} (x${item.quantity})</p>
          <p>₹${subtotal}</p>
        </div>
      `;
    });

    orderTotalSpan.textContent = `₹${total.toFixed(2)}`;
    console.log('Order total:', total);
  } catch (error) {
    console.error('Error in renderOrderSummary:', error);
    alert(`Failed to render order summary: ${error.message}. Please refresh the page.`);
  }
}

// Complete purchase
function completePurchase() {
  try {
    if (cart.length === 0) {
      console.log('Attempted purchase with empty cart');
      alert('Your cart is empty!');
      return;
    }
    const fullNameInput = document.getElementById('full-name');
    const mobileNumberInput = document.getElementById('mobile-number');
    const shippingAddressInput = document.getElementById('shipping-address');
    const deliveryTimeInput = document.getElementById('delivery-time');

    if (!fullNameInput || !mobileNumberInput || !shippingAddressInput || !deliveryTimeInput) {
      throw new Error('One or more checkout form fields are missing');
    }

    const fullName = fullNameInput.value.trim();
    const mobileNumber = mobileNumberInput.value.trim();
    const shippingAddress = shippingAddressInput.value.trim();
    const deliveryTime = deliveryTimeInput.value.trim();

    if (!fullName || !mobileNumber || !shippingAddress || !deliveryTime) {
      console.warn('Form validation failed: missing required fields');
      alert('Please fill in all required fields.');
      return;
    }
    console.log('Completing purchase with details:', { fullName, mobileNumber, shippingAddress, deliveryTime });
    alert('Order placed successfully! Payment details will be sent via WhatsApp or Email.');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart after purchase:', cart);
    window.location.href = 'cart.html';
  } catch (error) {
    console.error('Error in completePurchase:', error);
    alert(`Failed to complete purchase: ${error.message}. Please try again.`);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded at', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  try {
    // Re-fetch cart from localStorage to ensure latest state
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart = JSON.parse(storedCart);
      console.log('Cart re-fetched on page load:', cart);
    } else {
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    if (document.getElementById('cart-items')) {
      console.log('Initializing cart rendering');
      renderCart();
    }
    if (document.getElementById('order-summary')) {
      console.log('Initializing order summary rendering');
      renderOrderSummary();
    }
  } catch (error) {
    console.error('Error in DOMContentLoaded:', error);
    alert(`Initialization failed: ${error.message}. Please refresh the page.`);
  }
});