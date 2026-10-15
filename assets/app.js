
"use strict";

/*
 * BLURANCY CARTIFY
 * Shopping features + real OTP API integration
 *
 * Render API:
 * https://blurancy-cartify.onrender.com
 *
 * Required OTP HTML IDs:
 * otpPhone, otpCode, sendOtpBtn, verifyOtpBtn, otpMessage
 *
 * Optional shopping HTML IDs:
 * productGrid, searchForm, searchInput, cartBtn, cartCount,
 * noProducts, productResultText
 */

const CARTIFY_CONFIG = {
  otpApi: "https://blurancy-cartify.onrender.com",
  productsUrl: "./products.json",
  cartStorageKey: "blurancy_cart"
};

const $ = (selector, root = document) => root.querySelector(selector);

const $$ = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

let cartifyProducts = [];
let cartifyOtpSentTo = "";
let cartifyVerifiedPhone = "";
let cartifyCategory = "all";
let cartifySearch = "";

/* ------------------------------
   GENERAL HELPERS
------------------------------ */

function showMessage(element, message, type = "info") {
  if (!element) {
    console.log(message);
    return;
  }

  element.textContent = message;
  element.dataset.status = type;
  element.setAttribute("role", "status");

  element.style.color =
    type === "error" ? "#c62828" :
    type === "success" ? "#16803c" :
    "#333333";
}

async function readJsonResponse(response) {
  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

function normalizeIndianPhone(value) {
  let digits = String(value || "").replace(/\D/g, "");

  if (digits.startsWith("91") && digits.length === 12) {
    digits = digits.slice(2);
  }

  if (digits.length !== 10 || !/^[6-9]\d{9}$/.test(digits)) {
    throw new Error(
      "Enter a valid 10-digit Indian mobile number."
    );
  }

  return `+91${digits}`;
}

function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(Number(amount) || 0);
}

/* ------------------------------
   REAL OTP: SEND
------------------------------ */

async function sendCartifyOTP() {
  const phoneInput = $("#otpPhone");
  const sendButton = $("#sendOtpBtn");
  const message = $("#otpMessage");

  if (!phoneInput) {
    console.error("Missing #otpPhone in index.html");
    return;
  }

  let phone;

  try {
    phone = normalizeIndianPhone(phoneInput.value);
  } catch (error) {
    showMessage(message, error.message, "error");
    return;
  }

  if (sendButton) sendButton.disabled = true;

  showMessage(message, "Requesting an SMS OTP...", "info");

  try {
    const response = await fetch(
      `${CARTIFY_CONFIG.otpApi}/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      }
    );

    const data = await readJsonResponse(response);

    cartifyOtpSentTo = phone;
    cartifyVerifiedPhone = "";

    const codeInput = $("#otpCode");
    if (codeInput) {
      codeInput.value = "";
      codeInput.disabled = false;
    }

    showMessage(
      message,
      data.message || "OTP request accepted. Check your SMS messages.",
      "success"
    );
  } catch (error) {
    console.error("OTP send error:", error);

    showMessage(
      message,
      `${error.message} Check the Render server, SMS provider, and CORS configuration.`,
      "error"
    );
  } finally {
    if (sendButton) sendButton.disabled = false;
  }
}

/* ------------------------------
   REAL OTP: VERIFY
------------------------------ */

async function verifyCartifyOTP() {
  const phoneInput = $("#otpPhone");
  const codeInput = $("#otpCode");
  const verifyButton = $("#verifyOtpBtn");
  const message = $("#otpMessage");

  if (!phoneInput || !codeInput) {
    showMessage(
      message,
      "OTP phone or code field is missing from index.html.",
      "error"
    );
    return;
  }

  let phone;

  try {
    phone = normalizeIndianPhone(phoneInput.value);
  } catch (error) {
    showMessage(message, error.message, "error");
    return;
  }

  const otp = codeInput.value.trim();

  if (!/^\d{6}$/.test(otp)) {
    showMessage(message, "Enter the 6-digit OTP received by SMS.", "error");
    return;
  }

  if (!cartifyOtpSentTo || phone !== cartifyOtpSentTo) {
    showMessage(
      message,
      "Send a new OTP to this phone number before verifying.",
      "error"
    );
    return;
  }

  if (verifyButton) verifyButton.disabled = true;

  showMessage(message, "Verifying OTP...", "info");

  try {
    const response = await fetch(
      `${CARTIFY_CONFIG.otpApi}/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, otp })
      }
    );

    const data = await readJsonResponse(response);

    if (data.verified !== true) {
      throw new Error(data.message || "OTP verification failed.");
    }

    cartifyVerifiedPhone = phone;

    showMessage(
      message,
      "Phone number verified successfully.",
      "success"
    );

    document.dispatchEvent(
      new CustomEvent("cartify:phone-verified", {
        detail: { phone }
      })
    );
  } catch (error) {
    console.error("OTP verification error:", error);

    showMessage(message, error.message, "error");
  } finally {
    if (verifyButton) verifyButton.disabled = false;
  }
}

/* ------------------------------
   SHOPPING CART
------------------------------ */

function getCart() {
  try {
    const cart = JSON.parse(
      localStorage.getItem(CARTIFY_CONFIG.cartStorageKey) || "[]"
    );

    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(
    CARTIFY_CONFIG.cartStorageKey,
    JSON.stringify(cart)
  );

  updateCartCount();

  document.dispatchEvent(
    new CustomEvent("cartify:cart-updated", {
      detail: { cart }
    })
  );
}

function addToCart(productId) {
  const product = cartifyProducts.find(
    item => String(item.id) === String(productId)
  );

  if (!product) {
    showMessage(
      $("#productResultText"),
      "Product not found. Reload the product list.",
      "error"
    );
    return;
  }

  const cart = getCart();
  const existing = cart.find(
    item => String(item.id) === String(productId)
  );

  if (existing) {
    existing.quantity = (Number(existing.quantity) || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || "",
      quantity: 1
    });
  }

  saveCart(cart);

  showMessage(
    $("#productResultText"),
    `${product.name} added to your cart.`,
    "success"
  );
}

function changeCartQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(
    product => String(product.id) === String(productId)
  );

  if (!item) return;

  item.quantity = (Number(item.quantity) || 1) + change;

  const updatedCart = cart.filter(item => item.quantity > 0);

  saveCart(updatedCart);
  renderCart();
}

function removeFromCart(productId) {
  saveCart(
    getCart().filter(
      item => String(item.id) !== String(productId)
    )
  );

  renderCart();
}

function getCartTotal() {
  return getCart().reduce((total, item) => {
    return total +
      (Number(item.price) || 0) *
      (Number(item.quantity) || 1);
  }, 0);
}

function updateCartCount() {
  const countElement = $("#cartCount");
  if (!countElement) return;

  const count = getCart().reduce(
    (total, item) => total + (Number(item.quantity) || 1),
    0
  );

  countElement.textContent = String(count);
}

function renderCart() {
  const cartContainer = $("#cartItems");
  const totalElement = $("#cartTotal");
  const subtotalElement = $("#cartSubtotal");

  if (!cartContainer && !totalElement && !subtotalElement) return;

  const cart = getCart();

  if (cartContainer) {
    cartContainer.replaceChildren();

    if (cart.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Your cart is empty.";
      cartContainer.appendChild(empty);
    }

    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";

      const name = document.createElement("span");
      name.textContent = item.name || "Product";

      const quantity = document.createElement("span");
      quantity.textContent = `Qty: ${item.quantity}`;

      const price = document.createElement("span");
      price.textContent = formatRupees(
        (Number(item.price) || 0) * (Number(item.quantity) || 1)
      );

      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Decrease quantity");
      minus.addEventListener("click", () => {
        changeCartQuantity(item.id, -1);
      });

      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Increase quantity");
      plus.addEventListener("click", () => {
        changeCartQuantity(item.id, 1);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeFromCart(item.id));

      row.append(name, quantity, price, minus, plus, remove);
      cartContainer.appendChild(row);
    });
  }

  if (subtotalElement) {
    subtotalElement.textContent = formatRupees(getCartTotal());
  }

  if (totalElement) {
    totalElement.textContent = formatRupees(getCartTotal());
  }
}

/* ------------------------------
   PRODUCT LIST
------------------------------ */

function getProductName(product) {
  return product.name || product.product_name || product.title || "Product";
}

function getProductImage(product) {
  return product.image ||
    product.image_url ||
    product.imageUrl ||
    "";
}

function getProductCategory(product) {
  return product.category ||
    product.category_name ||
    "Other";
}

function renderProducts(products = cartifyProducts) {
  const grid = $("#productGrid");

  if (!grid) {
    console.warn(
      "No #productGrid found. Existing product HTML will be left unchanged."
    );
    return;
  }

  const filtered = products.filter(product => {
    const name = getProductName(product).toLowerCase();
    const category = getProductCategory(product).toLowerCase();

    const matchesSearch =
      !cartifySearch ||
      name.includes(cartifySearch) ||
      String(product.description || "")
        .toLowerCase()
        .includes(cartifySearch);

    const matchesCategory =
      cartifyCategory === "all" ||
      category === cartifyCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  grid.replaceChildren();

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.alt = getProductName(product);
    image.loading = "lazy";
    image.src = getProductImage(product);

    image.addEventListener("error", () => {
      image.hidden = true;
    });

    const title = document.createElement("h3");
    title.textContent = getProductName(product);

    const description = document.createElement("p");
    description.textContent = product.description || "";

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatRupees(product.price);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "add-to-cart";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => {
      addToCart(product.id);
    });

    card.append(image, title, description, price, addButton);
    grid.appendChild(card);
  });

  const noProducts = $("#noProducts");
  if (noProducts) {
    noProducts.hidden = filtered.length > 0;
  }

  const resultText = $("#productResultText");
  if (resultText) {
    resultText.textContent = `${filtered.length} product(s) found`;
  }
}

async function loadProducts() {
  const grid = $("#productGrid");

  try {
    const response = await fetch(
      `${CARTIFY_CONFIG.productsUrl}?v=2`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`Products request failed: ${response.status}`);
    }

    const data = await response.json();

    const products = Array.isArray(data)
      ? data
      : Array.isArray(data.products)
        ? data.products
        : [];

    if (products.length === 0) {
      throw new Error("The product file contains no products.");
    }

    cartifyProducts = products.map((product, index) => ({
      ...product,
      id: product.id ?? index + 1,
      name: getProductName(product),
      image: getProductImage(product),
      category: getProductCategory(product),
      price: Number(product.price) || 0
    }));

    renderProducts();
  } catch (error) {
    console.warn("Could not load products.json:", error);

    // Do not erase existing HTML if this website already renders
    // products using Supabase or another script.
    if (grid && grid.children.length === 0) {
      const message = document.createElement("p");
      message.textContent =
        "Products could not be loaded. Check products.json or your product database connection.";
      grid.appendChild(message);
    }
  }
}

/* ------------------------------
   SEARCH AND CATEGORY FILTERS
------------------------------ */

function setupSearch() {
  const searchInput = $("#searchInput");
  const searchForm = $("#searchForm");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      cartifySearch = searchInput.value.trim().toLowerCase();
      renderProducts();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", event => {
      event.preventDefault();

      if (searchInput) {
        cartifySearch = searchInput.value.trim().toLowerCase();
        renderProducts();
      }
    });
  }

  $$("[data-category]").forEach(button => {
    button.addEventListener("click", () => {
      cartifyCategory =
        String(button.dataset.category || "all").toLowerCase();

      $$("[data-category]").forEach(item => {
        item.setAttribute(
          "aria-pressed",
          String(item === button)
        );
      });

      renderProducts();
    });
  });
}

/* ------------------------------
   BUTTON WIRING
------------------------------ */

function setupButtons() {
  const sendButton = $("#sendOtpBtn");
  const verifyButton = $("#verifyOtpBtn");

  if (sendButton) {
    sendButton.addEventListener("click", event => {
      event.preventDefault();
      sendCartifyOTP();
    });
  }

  if (verifyButton) {
    verifyButton.addEventListener("click", event => {
      event.preventDefault();
      verifyCartifyOTP();
    });
  }

  const cartButton = $("#cartBtn");
  if (cartButton) {
    cartButton.addEventListener("click", () => {
      const cartSection = $("#cartSection") || $("#cartItems");

      if (cartSection) {
        cartSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else {
        renderCart();
        alert(`Cart total: ${formatRupees(getCartTotal())}`);
      }
    });
  }

  const checkoutButton = $("#checkoutBtn");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (getCart().length === 0) {
        alert("Your cart is empty.");
        return;
      }

      if (!cartifyVerifiedPhone) {
        alert("Please verify your phone number before checkout.");
        return;
      }

      // This is only a frontend validation step.
      // Connect a secure backend before creating real orders
      // or accepting payments.
      document.dispatchEvent(
        new CustomEvent("cartify:checkout-requested", {
          detail: {
            phone: cartifyVerifiedPhone,
            cart: getCart(),
            total: getCartTotal()
          }
        })
      );

      alert(
        "Phone verified. Checkout still needs a secure order and payment backend."
      );
    });
  }

  const phoneInput = $("#otpPhone");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      if (cartifyOtpSentTo) {
        try {
          if (normalizeIndianPhone(phoneInput.value) !== cartifyOtpSentTo) {
            cartifyOtpSentTo = "";
            cartifyVerifiedPhone = "";
          }
        } catch {
          cartifyOtpSentTo = "";
          cartifyVerifiedPhone = "";
        }
      }
    });
  }
}

/* ------------------------------
   INITIALIZE
------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  setupButtons();
  setupSearch();

  updateCartCount();
  renderCart();

  // Keep the OTP UI usable even if products fail to load.
  loadProducts();
});
