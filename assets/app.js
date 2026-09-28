document.addEventListener("DOMContentLoaded", function () {

  const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Earbuds",
      category: "Electronics",
      price: 999,
      oldPrice: 1999,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: 2,
      name: "Smart Watch",
      category: "Electronics",
      price: 1499,
      oldPrice: 2999,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: 3,
      name: "Cotton T-Shirt",
      category: "Fashion",
      price: 499,
      oldPrice: 999,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: 4,
      name: "Running Shoes",
      category: "Fashion",
      price: 1299,
      oldPrice: 2499,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: 5,
      name: "LED Desk Lamp",
      category: "Home",
      price: 699,
      oldPrice: 1299,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: 6,
      name: "Portable Bluetooth Speaker",
      category: "Electronics",
      price: 1199,
      oldPrice: 2199,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"
    }
  ];

  let cart = JSON.parse(localStorage.getItem("blurancyCart") || "[]");

  const productGrid = document.getElementById("productGrid");
  const cartCount = document.getElementById("cartCount");
  const cartDrawer = document.getElementById("cartDrawer");
  const loginModal = document.getElementById("loginModal");
  const infoModal = document.getElementById("infoModal");
  const overlay = document.getElementById("overlay");

  function rupees(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
  }

  /* ================================
     PRODUCTS
     ================================ */

  function renderProducts(list) {
    if (!productGrid) return;

    if (list.length === 0) {
      productGrid.innerHTML = `
        <div class="empty-state">
          <h2>No products found</h2>
          <p>Try another search or category.</p>
        </div>
      `;
      return;
    }

    productGrid.innerHTML = list.map(function (product) {

      const discount = Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );

      return `
        <article class="product-card">

          <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

          <div class="product-info">

            <h3 class="product-name">${product.name}</h3>

            <p class="product-description">
              ${product.category}
            </p>

            <div>
              <strong class="product-price">
                ${rupees(product.price)}
              </strong>

              <del class="original-price">
                ${rupees(product.oldPrice)}
              </del>
            </div>

            <span class="discount">
              ${discount}% OFF
            </span>

            <button
              class="primary full"
              onclick="addToCart(${product.id})"
            >
              Add to Cart
            </button>

          </div>

        </article>
      `;

    }).join("");
  }

  /* ================================
     CART
     ================================ */

  window.addToCart = function (id) {

    const product = products.find(function (item) {
      return item.id === id;
    });

    if (!product) return;

    const existing = cart.find(function (item) {
      return item.id === id;
    });

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        id: id,
        quantity: 1
      });
    }

    saveCart();
    updateCartCount();
    renderCart();

    alert(product.name + " added to cart!");
  };

  function saveCart() {
    localStorage.setItem(
      "blurancyCart",
      JSON.stringify(cart)
    );
  }

  function updateCartCount() {

    const total = cart.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);

    if (cartCount) {
      cartCount.textContent = total;
    }
  }

  function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some products to continue.</p>
        </div>
      `;

      cartTotal.textContent = "₹0";
      return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map(function (item) {

      const product = products.find(function (p) {
        return p.id === item.id;
      });

      if (!product) return "";

      const itemTotal = product.price * item.quantity;

      total += itemTotal;

      return `
        <div class="cart-item">

          <img
            src="${product.image}"
            alt="${product.name}"
          >

          <div class="cart-item-info">
            <strong>${product.name}</strong>
            <p>${rupees(product.price)}</p>

            <div class="quantity-controls">

              <button onclick="changeQuantity(${product.id}, -1)">
                −
              </button>

              <span>${item.quantity}</span>

              <button onclick="changeQuantity(${product.id}, 1)">
                +
              </button>

            </div>

            <button
              class="small"
              onclick="removeFromCart(${product.id})"
            >
              Remove
            </button>
          </div>

        </div>
      `;

    }).join("");

    cartTotal.textContent = rupees(total);
  }

  window.changeQuantity = function (id, amount) {

    const item = cart.find(function (cartItem) {
      return cartItem.id === id;
    });

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      cart = cart.filter(function (cartItem) {
        return cartItem.id !== id;
      });
    }

    saveCart();
    updateCartCount();
    renderCart();
  };

  window.removeFromCart = function (id) {

    cart = cart.filter(function (item) {
      return item.id !== id;
    });

    saveCart();
    updateCartCount();
    renderCart();
  };

  /* ================================
     CART BUTTON
     ================================ */

  const cartBtn = document.getElementById("cartBtn");

  if (cartBtn) {
    cartBtn.addEventListener("click", function () {

      renderCart();

      if (cartDrawer) {
        cartDrawer.classList.add("open");
      }

      if (overlay) {
        overlay.hidden = false;
      }

    });
  }

  /* ================================
     LOGIN
     ================================ */

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {
    loginBtn.addEventListener("click", function () {

      if (loginModal) {
        loginModal.hidden = false;
      }

      if (overlay) {
        overlay.hidden = false;
      }

    });
  }

  window.demoLogin = function () {

    const loginMsg = document.getElementById("loginMsg");

    if (loginMsg) {
      loginMsg.textContent =
        "Demo login only. Connect your production authentication system before launch.";
    }

  };

  /* ================================
     INFORMATION MODAL
     ================================ */

  window.openInfo = function (title) {

    const infoTitle = document.getElementById("infoTitle");
    const infoText = document.getElementById("infoText");

    if (infoTitle) {
      infoTitle.textContent = title;
    }

    if (infoText) {

      if (title === "Privacy Policy") {
        infoText.textContent =
          "Privacy policy information will be displayed here. Add your final production privacy policy before launch.";
      }

      else if (title === "Terms & Conditions") {
        infoText.textContent =
          "Terms and conditions will be displayed here. Add your final production terms before launch.";
      }

      else if (title === "Refund Policy") {
        infoText.textContent =
          "Refund policy information will be displayed here. Add your final production refund policy before launch.";
      }

      else {
        infoText.textContent =
          "Information will be displayed here.";
      }
    }

    if (infoModal) {
      infoModal.hidden = false;
    }

    if (overlay) {
      overlay.hidden = false;
    }
  };

  /* ================================
     CLOSE PANELS
     ================================ */

  window.closePanels = function () {

    if (cartDrawer) {
      cartDrawer.classList.remove("open");
    }

    if (loginModal) {
      loginModal.hidden = true;
    }

    if (infoModal) {
      infoModal.hidden = true;
    }

    if (overlay) {
      overlay.hidden = true;
    }
  };

  if (overlay) {
    overlay.addEventListener("click", function () {
      closePanels();
    });
  }

  /* ================================
     CHECKOUT
     ================================ */

  window.checkout = function () {

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    alert(
      "Checkout UI is ready. Production payment integration and backend order processing must be connected before accepting real payments."
    );
  };

  /* ================================
     SEARCH
     ================================ */

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  if (searchForm && searchInput) {

    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
    });

    searchInput.addEventListener("input", function () {

      const search = searchInput.value
        .toLowerCase()
        .trim();

      const filtered = products.filter(function (product) {

        return (
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
        );

      });

      renderProducts(filtered);
    });
  }

  /* ================================
     CATEGORY FILTER
     ================================ */

  const categoryFilter =
    document.getElementById("categoryFilter");

  if (categoryFilter) {

    categoryFilter.addEventListener("change", function () {

      const category = categoryFilter.value;

      if (category === "all") {
        renderProducts(products);
        return;
      }

      const filtered = products.filter(function (product) {

        return product.category.toLowerCase() ===
          category.toLowerCase();

      });

      renderProducts(filtered);
    });
  }

  /* ================================
     INITIAL LOAD
     ================================ */

  renderProducts(products);
  updateCartCount();
  renderCart();

});                                                                                                                      
