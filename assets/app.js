
"use strict";

/*
 * Blurancy Cartify
 * Shopping + real OTP API integration
 *
 * API: https://blurancy-cartify.onrender.com
 * Requires the server's /send-otp and /verify-otp routes.
 * Never use demo OTPs for real authentication.
 */

const OTP_API = "https://blurancy-cartify.onrender.com";

const Cartify = {
  products: [],
  cart: JSON.parse(localStorage.getItem("blurancy_cart") || "[]"),
  verifiedPhone: null
};

async function apiRequest(path, data) {
  const response = await fetch(`${OTP_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || `Server error (${response.status})`);
  }

  return result;
}

// ---------- REAL OTP: NO BROWSER-GENERATED CODES ----------

async function sendCartifyOTP(phone) {
  const normalized = phone.replace(/[\s()-]/g, "");

  if (!/^\+91[6-9]\d{9}$/.test(normalized)) {
    throw new Error("Enter an Indian mobile number like +919876543210.");
  }

  Cartify.verifiedPhone = null;

  const result = await apiRequest("/send-otp", {
    phone: normalized
  });

  showMessage(
    "otpMessage",
    result.message || "OTP request completed. Check your phone if SMS delivery is configured."
  );

  return result;
}

async function verifyCartifyOTP(phone, otp) {
  const normalized = phone.replace(/[\s()-]/g, "");

  if (!/^\+91[6-9]\d{9}$/.test(normalized)) {
    throw new Error("Enter a valid Indian mobile number.");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new Error("Enter the six-digit OTP.");
  }

  const result = await apiRequest("/verify-otp", {
    phone: normalized,
    otp: otp
  });

  if (result.verified !== true) {
    throw new Error("Phone verification was not confirmed.");
  }

  Cartify.verifiedPhone = normalized;
  showMessage("otpMessage", "Phone number verified successfully.");
  return result;
}

// ---------- USER INTERFACE HELPERS ----------

function showMessage(id, message) {
  const element = document.getElementById(id);
  if (element) element.textContent = message;
}

function bindOTPForm() {
  const sendButton = document.getElementById("sendOtpBtn");
  const verifyButton = document.getElementById("verifyOtpBtn");

  if (sendButton) {
    sendButton.addEventListener("click", async () => {
      const phone = document.getElementById("otpPhone")?.value || "";
      sendButton.disabled = true;

      try {
        await sendCartifyOTP(phone);
      } catch (error) {
        showMessage("otpMessage", error.message);
      } finally {
        sendButton.disabled = false;
      }
    });
  }

  if (verifyButton) {
    verifyButton.addEventListener("click", async () => {
      const phone = document.getElementById("otpPhone")?.value || "";
      const otp = document.getElementById("otpCode")?.value || "";
      verifyButton.disabled = true;

      try {
        await verifyCartifyOTP(phone, otp);
      } catch (error) {
        showMessage("otpMessage", error.message);
      } finally {
        verifyButton.disabled = false;
      }
    });
  }
}

// ---------- SHOPPING: PRODUCT DISPLAY ----------

function renderProducts(products = Cartify.products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.replaceChildren();

  products.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const title = document.createElement("h3");
    title.textContent = product.name || product.title || "Product";

    const price = document.createElement("p");
    price.textContent = `₹${Number(product.price || 0).toFixed(2)}`;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product));

    card.append(title, price, addButton);
    grid.appendChild(card);
  });

  showMessage("productResultText", `${products.length} products`);
}

function filterProducts() {
  const search = (
    document.getElementById("searchInput")?.value || ""
  ).trim().toLowerCase();

  const category = document.getElementById("categoryFilter")?.value || "";

  const filtered = Cartify.products.filter(product => {
    const name = product.name || product.title || "";
    const matchesSearch = name.toLowerCase().includes(search);
    const matchesCategory = !category || product.category === category;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

async function loadProducts() {
  // Adapt this endpoint if your catalogue uses Supabase or another API.
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  try {
    const response = await fetch("./products.json");

    if (!response.ok) {
      throw new Error("No products.json catalogue was found.");
    }

    const data = await response.json();
    Cartify.products = Array.isArray(data) ? data : data.products || [];
    renderProducts();
  } catch (error) {
    showMessage(
      "productResultText",
      "Product catalogue not connected. Configure products.json or your product database."
    );
  }
}

// ---------- SHOPPING: CART ----------

function saveCart() {
  localStorage.setItem("blurancy_cart", JSON.stringify(Cartify.cart));
  updateCartCount();
}

function addToCart(product) {
  const id = product.id ?? product.product_id ?? product.name;
  const existing = Cartify.cart.find(item => item.id === id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    Cartify.cart.push({
      id,
      name: product.name || product.title || "Product",
      price: Number(product.price || 0),
      quantity: 1
    });
  }

  saveCart();
  showMessage("cartMessage", "Product added to your cart.");
}

function updateCartCount() {
  const count = Cartify.cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const element = document.getElementById("cartCount");
  if (element) element.textContent = String(count);
}

// ---------- INITIALIZE ----------

document.addEventListener("DOMContentLoaded", () => {
  bindOTPForm();
  loadProducts();
  updateCartCount();

  document.getElementById("searchInput")
    ?.addEventListener("input", filterProducts);

  document.getElementById("categoryFilter")
    ?.addEventListener("change", filterProducts);
});
