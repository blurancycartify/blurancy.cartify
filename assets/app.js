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
  const products = [
  // 1–5 Electronics
  {
    id: 1,
    name: "Wireless Bluetooth Earbuds",
    price: 999,
    oldPrice: 1999,
    category: "Electronics",
    image: "https://placehold.co/600x600/png?text=Wireless+Earbuds"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 1499,
    oldPrice: 2999,
    category: "Electronics",
    image: "https://placehold.co/600x600/png?text=Smart+Watch"
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    price: 499,
    oldPrice: 999,
    category: "Fashion",
    image: "https://placehold.co/600x600/png?text=Cotton+T-Shirt"
  },
  {
    id: 4,
    name: "Bluetooth Wireless Headphones",
    price: 1799,
    oldPrice: 2999,
    category: "Electronics",
    image: "https://placehold.co/600x600/png?text=Headphones"
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    price: 1299,
    oldPrice: 2499,
    category: "Electronics",
    image: "https://placehold.co/600x600/png?text=Bluetooth+Speaker"
  },

  // 6–10 Mobiles & Accessories
  {
    id: 6,
    name: "Fast Charging Power Bank 20000mAh",
    price: 1499,
    oldPrice: 2499,
    category: "Mobiles",
    image: "https://placehold.co/600x600/png?text=Power+Bank"
  },
  {
    id: 7,
    name: "USB-C Fast Charger",
    price: 699,
    oldPrice: 1199,
    category: "Mobiles",
    image: "https://placehold.co/600x600/png?text=USB-C+Charger"
  },
  {
    id: 8,
    name: "Braided USB-C Cable",
    price: 299,
    oldPrice: 599,
    category: "Mobiles",
    image: "https://placehold.co/600x600/png?text=USB-C+Cable"
  },
  {
    id: 9,
    name: "Universal Phone Stand",
    price: 349,
    oldPrice: 699,
    category: "Mobiles",
    image: "https://placehold.co/600x600/png?text=Phone+Stand"
  },
  {
    id: 10,
    name: "Premium Phone Case",
    price: 399,
    oldPrice: 799,
    category: "Mobiles",
    image: "https://placehold.co/600x600/png?text=Phone+Case"
  },

  // 11–15 Computers
  {
    id: 11,
    name: "Wireless Keyboard",
    price: 899,
    oldPrice: 1499,
    category: "Computers",
    image: "https://placehold.co/600x600/png?text=Keyboard"
  },
  {
    id: 12,
    name: "Wireless Mouse",
    price: 499,
    oldPrice: 899,
    category: "Computers",
    image: "https://placehold.co/600x600/png?text=Wireless+Mouse"
  },
  {
    id: 13,
    name: "Laptop Backpack",
    price: 1199,
    oldPrice: 1999,
    category: "Computers",
    image: "https://placehold.co/600x600/png?text=Laptop+Backpack"
  },
  {
    id: 14,
    name: "USB Hub 4-Port",
    price: 599,
    oldPrice: 999,
    category: "Computers",
    image: "https://placehold.co/600x600/png?text=USB+Hub"
  },
  {
    id: 15,
    name: "Laptop Cooling Pad",
    price: 899,
    oldPrice: 1499,
    category: "Computers",
    image: "https://placehold.co/600x600/png?text=Cooling+Pad"
  },

  // 16–20 Fashion
  {
    id: 16,
    name: "Men's Casual Shirt",
    price: 799,
    oldPrice: 1499,
    category: "Fashion",
    image: "https://placehold.co/600x600/png?text=Casual+Shirt"
  },
  {
    id: 17,
    name: "Men's Regular Fit Jeans",
    price: 1199,
    oldPrice: 1999,
    category: "Fashion",
    image: "https://placehold.co/600x600/png?text=Mens+Jeans"
  },
  {
    id: 18,
    name: "Women's Casual Top",
    price: 599,
    oldPrice: 1199,
    category: "Fashion",
    image: "https://placehold.co/600x600/png?text=Womens+Top"
  },
  {
    id: 19,
    name: "Women's Denim Jeans",
    price: 1099,
    oldPrice: 1999,
    category: "Fashion",
    image: "https://placehold.co/600x600/png?text=Womens+Jeans"
  },
  {
    id: 20,
    name: "Hooded Sweatshirt",
    price: 999,
    oldPrice: 1799,
    category: "Fashion",
    image: "https://placehold.co/600x600/png?text=Hoodie"
  },

  // 21–25 Footwear
  {
    id: 21,
    name: "Men's Running Shoes",
    price: 1299,
    oldPrice: 2499,
    category: "Footwear",
    image: "https://placehold.co/600x600/png?text=Running+Shoes"
  },
  {
    id: 22,
    name: "Women's Walking Shoes",
    price: 1199,
    oldPrice: 2299,
    category: "Footwear",
    image: "https://placehold.co/600x600/png?text=Walking+Shoes"
  },
  {
    id: 23,
    name: "Casual Sneakers",
    price: 1499,
    oldPrice: 2999,
    category: "Footwear",
    image: "https://placehold.co/600x600/png?text=Sneakers"
  },
  {
    id: 24,
    name: "Comfort Slippers",
    price: 399,
    oldPrice: 699,
    category: "Footwear",
    image: "https://placehold.co/600x600/png?text=Slippers"
  },
  {
    id: 25,
    name: "Sports Sandals",
    price: 699,
    oldPrice: 1299,
    category: "Footwear",
    image: "https://placehold.co/600x600/png?text=Sports+Sandals"
  },

  // 26–30 Bags
  {
    id: 26,
    name: "Travel Backpack",
    price: 899,
    oldPrice: 1599,
    category: "Bags",
    image: "https://placehold.co/600x600/png?text=Travel+Backpack"
  },
  {
    id: 27,
    name: "Laptop Bag",
    price: 999,
    oldPrice: 1799,
    category: "Bags",
    image: "https://placehold.co/600x600/png?text=Laptop+Bag"
  },
  {
    id: 28,
    name: "Women's Handbag",
    price: 799,
    oldPrice: 1499,
    category: "Bags",
    image: "https://placehold.co/600x600/png?text=Handbag"
  },
  {
    id: 29,
    name: "Travel Duffle Bag",
    price: 1199,
    oldPrice: 2199,
    category: "Bags",
    image: "https://placehold.co/600x600/png?text=Duffle+Bag"
  },
  {
    id: 30,
    name: "School Backpack",
    price: 699,
    oldPrice: 1199,
    category: "Bags",
    image: "https://placehold.co/600x600/png?text=School+Backpack"
  },

  // 31–35 Beauty & Personal Care
  {
    id: 31,
    name: "Face Wash",
    price: 299,
    oldPrice: 499,
    category: "Beauty",
    image: "https://placehold.co/600x600/png?text=Face+Wash"
  },
  {
    id: 32,
    name: "Moisturizing Face Cream",
    price: 399,
    oldPrice: 699,
    category: "Beauty",
    image: "https://placehold.co/600x600/png?text=Face+Cream"
  },
  {
    id: 33,
    name: "Shampoo",
    price: 349,
    oldPrice: 499,
    category: "Beauty",
    image: "https://placehold.co/600x600/png?text=Shampoo"
  },
  {
    id: 34,
    name: "Hair Conditioner",
    price: 349,
    oldPrice: 549,
    category: "Beauty",
    image: "https://placehold.co/600x600/png?text=Conditioner"
  },
  {
    id: 35,
    name: "Body Lotion",
    price: 299,
    oldPrice: 499,
    category: "Beauty",
    image: "https://placehold.co/600x600/png?text=Body+Lotion"
  },

  // 36–40 Home & Kitchen
  {
    id: 36,
    name: "Stainless Steel Water Bottle",
    price: 499,
    oldPrice: 899,
    category: "Home & Kitchen",
    image: "https://placehold.co/600x600/png?text=Water+Bottle"
  },
  {
    id: 37,
    name: "Non-Stick Frying Pan",
    price: 799,
    oldPrice: 1299,
    category: "Home & Kitchen",
    image: "https://placehold.co/600x600/png?text=Frying+Pan"
  },
  {
    id: 38,
    name: "Kitchen Storage Container Set",
    price: 699,
    oldPrice: 1199,
    category: "Home & Kitchen",
    image: "https://placehold.co/600x600/png?text=Storage+Containers"
  },
  {
    id: 39,
    name: "Electric Kettle",
    price: 999,
    oldPrice: 1599,
    category: "Home & Kitchen",
    image: "https://placehold.co/600x600/png?text=Electric+Kettle"
  },
  {
    id: 40,
    name: "Stainless Steel Lunch Box",
    price: 599,
    oldPrice: 999,
    category: "Home & Kitchen",
    image: "https://placehold.co/600x600/png?text=Lunch+Box"
  },

  // 41–45 Home Decor
  {
    id: 41,
    name: "LED Table Lamp",
    price: 699,
    oldPrice: 1199,
    category: "Home Decor",
    image: "https://placehold.co/600x600/png?text=Table+Lamp"
  },
  {
    id: 42,
    name: "Decorative Wall Clock",
    price: 799,
    oldPrice: 1299,
    category: "Home Decor",
    image: "https://placehold.co/600x600/png?text=Wall+Clock"
  },
  {
    id: 43,
    name: "Artificial Indoor Plant",
    price: 399,
    oldPrice: 699,
    category: "Home Decor",
    image: "https://placehold.co/600x600/png?text=Indoor+Plant"
  },
  {
    id: 44,
    name: "Decorative Cushion Set",
    price: 599,
    oldPrice: 999,
    category: "Home Decor",
    image: "https://placehold.co/600x600/png?text=Cushion+Set"
  },
  {
    id: 45,
    name: "LED String Lights",
    price: 299,
    oldPrice: 599,
    category: "Home Decor",
    image: "https://placehold.co/600x600/png?text=String+Lights"
  },

  // 46–50 Grocery & Food
  {
    id: 46,
    name: "Premium Basmati Rice 5kg",
    price: 599,
    oldPrice: 699,
    category: "Grocery",
    image: "https://placehold.co/600x600/png?text=Basmati+Rice"
  },
  {
    id: 47,
    name: "Wheat Flour 5kg",
    price: 299,
    oldPrice: 349,
    category: "Grocery",
    image: "https://placehold.co/600x600/png?text=Wheat+Flour"
  },
  {
    id: 48,
    name: "Toor Dal 1kg",
    price: 169,
    oldPrice: 199,
    category: "Grocery",
    image: "https://placehold.co/600x600/png?text=Toor+Dal"
  },
  {
    id: 49,
    name: "Organic Green Tea",
    price: 249,
    oldPrice: 399,
    category: "Grocery",
    image: "https://placehold.co/600x600/png?text=Green+Tea"
  },
  {
    id: 50,
    name: "Mixed Dry Fruits 500g",
    price: 499,
    oldPrice: 699,
    category: "Grocery",
    image: "https://placehold.co/600x600/png?text=Dry+Fruits"
  },

  // 51–55 Fitness
  {
    id: 51,
    name: "Yoga Mat",
    price: 599,
    oldPrice: 999,
    category: "Fitness",
    image: "https://placehold.co/600x600/png?text=Yoga+Mat"
  },
  {
    id: 52,
    name: "Adjustable Dumbbell",
    price: 1499,
    oldPrice: 2499,
    category: "Fitness",
    image: "https://placehold.co/600x600/png?text=Dumbbell"
  },
  {
    id: 53,
    name: "Resistance Band Set",
    price: 499,
    oldPrice: 899,
    category: "Fitness",
    image: "https://placehold.co/600x600/png?text=Resistance+Bands"
  },
  {
    id: 54,
    name: "Sports Water Bottle",
    price: 399,
    oldPrice: 699,
    category: "Fitness",
    image: "https://placehold.co/600x600/png?text=Sports+Bottle"
  },
  {
    id: 55,
    name: "Fitness Skipping Rope",
    price: 299,
    oldPrice: 499,
    category: "Fitness",
    image: "https://placehold.co/600x600/png?text=Skipping+Rope"
  },

  // 56–60 Books & Stationery
  {
    id: 56,
    name: "Hardcover Notebook",
    price: 199,
    oldPrice: 299,
    category: "Books & Stationery",
    image: "https://placehold.co/600x600/png?text=Notebook"
  },
  {
    id: 57,
    name: "Ball Pen Pack",
    price: 99,
    oldPrice: 149,
    category: "Books & Stationery",
    image: "https://placehold.co/600x600/png?text=Ball+Pens"
  },
  {
    id: 58,
    name: "Geometry Box",
    price: 149,
    oldPrice: 249,
    category: "Books & Stationery",
    image: "https://placehold.co/600x600/png?text=Geometry+Box"
  },
  {
    id: 59,
    name: "Study Planner",
    price: 249,
    oldPrice: 399,
    category: "Books & Stationery",
    image: "https://placehold.co/600x600/png?text=Study+Planner"
  },
  {
    id: 60,
    name: "Sticky Notes Set",
    price: 129,
    oldPrice: 199,
    category: "Books & Stationery",
    image: "https://placehold.co/600x600/png?text=Sticky+Notes"
  },

  // 61–65 Gaming
  {
    id: 61,
    name: "Gaming Mouse",
    price: 799,
    oldPrice: 1299,
    category: "Gaming",
    image: "https://placehold.co/600x600/png?text=Gaming+Mouse"
  },
  {
    id: 62,
    name: "Gaming Keyboard",
    price: 1499,
    oldPrice: 2499,
    category: "Gaming",
    image: "https://placehold.co/600x600/png?text=Gaming+Keyboard"
  },
  {
    id: 63,
    name: "Gaming Headset",
    price: 1299,
    oldPrice: 2199,
    category: "Gaming",
    image: "https://placehold.co/600x600/png?text=Gaming+Headset"
  },
  {
    id: 64,
    name: "RGB Gaming Mouse Pad",
    price: 699,
    oldPrice: 1199,
    category: "Gaming",
    image: "https://placehold.co/600x600/png?text=RGB+Mouse+Pad"
  },
  {
    id: 65,
    name: "Mobile Gaming Controller",
    price: 999,
    oldPrice: 1599,
    category: "Gaming",
    image: "https://placehold.co/600x600/png?text=Gaming+Controller"
  },

  // 66–70 Toys & Kids
  {
    id: 66,
    name: "Building Blocks Set",
    price: 499,
    oldPrice: 799,
    category: "Toys",
    image: "https://placehold.co/600x600/png?text=Building+Blocks"
  },
  {
    id: 67,
    name: "Remote Control Car",
    price: 899,
    oldPrice: 1499,
    category: "Toys",
    image: "https://placehold.co/600x600/png?text=RC+Car"
  },
  {
    id: 68,
    name: "Educational Puzzle Set",
    price: 399,
    oldPrice: 699,
    category: "Toys",
    image: "https://placehold.co/600x600/png?text=Puzzle+Set"
  },
  {
    id: 69,
    name: "Kids Drawing Kit",
    price: 299,
    oldPrice: 499,
    category: "Toys",
    image: "https://placehold.co/600x600/png?text=Drawing+Kit"
  },
  {
    id: 70,
    name: "Soft Teddy Bear",
    price: 599,
    oldPrice: 999,
    category: "Toys",
    image: "https://placehold.co/600x600/png?text=Teddy+Bear"
  },

  // 71–75 Automotive
  {
    id: 71,
    name: "Car Phone Holder",
    price: 399,
    oldPrice: 699,
    category: "Automotive",
    image: "https://placehold.co/600x600/png?text=Car+Phone+Holder"
  },
  {
    id: 72,
    name: "Car Cleaning Kit",
    price: 599,
    oldPrice: 999,
    category: "Automotive",
    image: "https://placehold.co/600x600/png?text=Car+Cleaning+Kit"
  },
  {
    id: 73,
    name: "Car Seat Cushion",
    price: 799,
    oldPrice: 1299,
    category: "Automotive",
    image: "https://placehold.co/600x600/png?text=Car+Seat+Cushion"
  },
  {
    id: 74,
    name: "Bike Phone Holder",
    price: 349,
    oldPrice: 599,
    category: "Automotive",
    image: "https://placehold.co/600x600/png?text=Bike+Phone+Holder"
  },
  {
    id: 75,
    name: "Car Emergency Tool Kit",
    price: 999,
    oldPrice: 1599,
    category: "Automotive",
    image: "https://placehold.co/600x600/png?text=Car+Tool+Kit"
  },

  // 76–80 Travel
  {
    id: 76,
    name: "Hard Shell Cabin Luggage",
    price: 2499,
    oldPrice: 3999,
    category: "Travel",
    image: "https://placehold.co/600x600/png?text=Cabin+Luggage"
  },
  {
    id: 77,
    name: "Travel Neck Pillow",
    price: 399,
    oldPrice: 699,
    category: "Travel",
    image: "https://placehold.co/600x600/png?text=Travel+Pillow"
  },
  {
    id: 78,
    name: "Passport Holder",
    price: 299,
    oldPrice: 499,
    category: "Travel",
    image: "https://placehold.co/600x600/png?text=Passport+Holder"
  },
  {
    id: 79,
    name: "Travel Organizer Pouch",
    price: 349,
    oldPrice: 599,
    category: "Travel",
    image: "https://placehold.co/600x600/png?text=Travel+Organizer"
  },
  {
    id: 80,
    name: "Foldable Travel Bag",
    price: 599,
    oldPrice: 999,
    category: "Travel",
    image: "https://placehold.co/600x600/png?text=Travel+Bag"
  },

  // 81–85 Garden & Outdoor
  {
    id: 81,
    name: "Gardening Tool Set",
    price: 699,
    oldPrice: 1199,
    category: "Garden & Outdoor",
    image: "https://placehold.co/600x600/png?text=Garden+Tools"
  },
  {
    id: 82,
    name: "Plant Watering Can",
    price: 299,
    oldPrice: 499,
    category: "Garden & Outdoor",
    image: "https://placehold.co/600x600/png?text=Watering+Can"
  },
  {
    id: 83,
    name: "Outdoor Camping Tent",
    price: 2499,
    oldPrice: 3999,
    category: "Garden & Outdoor",
    image: "https://placehold.co/600x600/png?text=Camping+Tent"
  },
  {
    id: 84,
    name: "LED Solar Garden Light",
    price: 499,
    oldPrice: 799,
    category: "Garden & Outdoor",
    image: "https://placehold.co/600x600/png?text=Solar+Garden+Light"
  },
  {
    id: 85,
    name: "Outdoor Folding Chair",
    price: 999,
    oldPrice: 1599,
    category: "Garden & Outdoor",
    image: "https://placehold.co/600x600/png?text=Folding+Chair"
  },

  // 86–90 Pet Supplies
  {
    id: 86,
    name: "Pet Feeding Bowl",
    price: 299,
    oldPrice: 499,
    category: "Pet Supplies",
    image: "https://placehold.co/600x600/png?text=Pet+Bowl"
  },
  {
    id: 87,
    name: "Pet Grooming Brush",
    price: 249,
    oldPrice: 399,
    category: "Pet Supplies",
    image: "https://placehold.co/600x600/png?text=Pet+Brush"
  },
  {
    id: 88,
    name: "Pet Collar",
    price: 199,
    oldPrice: 349,
    category: "Pet Supplies",
    image: "https://placehold.co/600x600/png?text=Pet+Collar"
  },
  {
    id: 89,
    name: "Pet Toy Ball",
    price: 149,
    oldPrice: 249,
    category: "Pet Supplies",
    image: "https://placehold.co/600x600/png?text=Pet+Toy"
  },
  {
    id: 90,
    name: "Pet Travel Bag",
    price: 999,
    oldPrice: 1599,
    category: "Pet Supplies",
    image: "https://placehold.co/600x600/png?text=Pet+Travel+Bag"
  },

  // 91–95 Office
  {
    id: 91,
    name: "Office Desk Organizer",
    price: 399,
    oldPrice: 699,
    category: "Office",
    image: "https://placehold.co/600x600/png?text=Desk+Organizer"
  },
  {
    id: 92,
    name: "Ergonomic Office Chair",
    price: 4999,
    oldPrice: 7999,
    category: "Office",
    image: "https://placehold.co/600x600/png?text=Office+Chair"
  },
  {
    id: 93,
    name: "LED Desk Light",
    price: 599,
    oldPrice: 999,
    category: "Office",
    image: "https://placehold.co/600x600/png?text=Desk+Light"
  },
  {
    id: 94,
    name: "Document File Organizer",
    price: 299,
    oldPrice: 499,
    category: "Office",
    image: "https://placehold.co/600x600/png?text=File+Organizer"
  },
  {
    id: 95,
    name: "A4 Printer Paper Pack",
    price: 399,
    oldPrice: 499,
    category: "Office",
    image: "https://placehold.co/600x600/png?text=Printer+Paper"
  },

  // 96–100 Accessories & Gifts
  {
    id: 96,
    name: "Classic Analog Watch",
    price: 999,
    oldPrice: 1999,
    category: "Accessories",
    image: "https://placehold.co/600x600/png?text=Analog+Watch"
  },
  {
    id: 97,
    name: "Sunglasses",
    price: 499,
    oldPrice: 999,
    category: "Accessories",
    image: "https://placehold.co/600x600/png?text=Sunglasses"
  },
  {
    id: 98,
    name: "Leather Wallet",
    price: 399,
    oldPrice: 799,
    category: "Accessories",
    image: "https://placehold.co/600x600/png?text=Leather+Wallet"
  },
  {
    id: 99,
    name: "Gift Hamper",
    price: 799,
    oldPrice: 1299,
    category: "Gifts",
    image: "https://placehold.co/600x600/png?text=Gift+Hamper"
  },
  {
    id: 100,
    name: "Premium Gift Box",
    price: 599,
    oldPrice: 999,
    category: "Gifts",
    image: "https://placehold.co/600x600/png?text=Gift+Box"
  }
];
