https://avfrwtvbbytyyoxoubjd.supabase.co/rest/v1/

sb_publishable_XW68RVEL3u7sRrHiZ0PoFQ_gTmfvncj

```javascript
/*
  Blurancy Cartify
  Customer frontend

  IMPORTANT:
  Replace these two values with your Supabase project values.

  Supabase Dashboard:
  Project Settings
  -> API
  -> Project URL
  -> Publishable/Anon key
*/

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const supabaseClient =
  window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/*
  Optional secure backend.

  Keep this EMPTY until your HTTPS backend is deployed.

  DO NOT put:
  - PayU LIVE Salt
  - payment secret
  - private API key
  - webhook secret

  in this file.
*/
const API_BASE_URL = "";

let products = [];
let cart = [];
let currentUser = null;
let currentSearch = "";
let currentCategory = "";
let minPrice = "";
let maxPrice = "";

const $ = (id) => document.getElementById(id);

function money(value) {
  return Number(value || 0).toLocaleString("en-IN");
}

function toast(message) {
  const el = $("toast");

  el.textContent = message;
  el.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    el.classList.remove("show");
  }, 2500);
}

function openModal(id) {
  $(id).classList.add("show");
}

function closeModal(id) {
  $(id).classList.remove("show");
}

function validPhone(phone) {
  return /^[6-9]\d{9}$/.test(String(phone));
}

function validPin(pin) {
  return /^\d{6}$/.test(String(pin));
}

/* -----------------------------
   API helper
----------------------------- */

async function backendRequest(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "Secure backend is not connected yet. Configure API_BASE_URL."
    );
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const { data: sessionData } =
    await supabaseClient.auth.getSession();

  if (sessionData?.session?.access_token) {
    headers.Authorization =
      `Bearer ${sessionData.session.access_token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Request failed."
    );
  }

  return data;
}

/* -----------------------------
   Products
----------------------------- */

async function loadProducts() {
  const container = $("products");

  container.innerHTML =
    `<div class="empty">Loading products...</div>`;

  try {
    /*
      IMPORTANT:
      This expects your product table to be called "products".

      If your completed SQL uses a different table name,
      change ONLY this query after checking your schema.
    */

    const { data, error } =
      await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    products = Array.isArray(data) ? data : [];

    buildCategories();
    renderProducts();

  } catch (error) {
    console.error("Product loading error:", error);

    container.innerHTML = `
      <div class="empty">
        <h3>Products could not be loaded</h3>
        <p>${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

function buildCategories() {
  const select = $("categoryFilter");

  const categories = [
    ...new Set(
      products
        .map(product => product.category)
        .filter(Boolean)
    )
  ].sort();

  select.innerHTML =
    `<option value="">All categories</option>`;

  for (const category of categories) {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    select.appendChild(option);
  }

  select.value = currentCategory;
}

function getProductImage(product) {
  return (
    product.image ||
    product.image_url ||
    product.thumbnail ||
    "https://via.placeholder.com/600x600?text=Blurancy+Cartify"
  );
}

function getProductPrice(product) {
  return Number(
    product.price ??
    product.sale_price ??
    0
  );
}

function getProductMrp(product) {
  return Number(
    product.mrp ??
    product.original_price ??
    getProductPrice(product)
  );
}

function getProductStock(product) {
  return Number(
    product.stock ??
    product.inventory ??
    0
  );
}

function renderProducts() {
  const container = $("products");

  const filtered = products.filter(product => {

    const name =
      String(product.name || "").toLowerCase();

    const category =
      String(product.category || "").toLowerCase();

    const search =
      currentSearch.toLowerCase();

    if (
      search &&
      !name.includes(search) &&
      !category.includes(search)
    ) {
      return false;
    }

    if (
      currentCategory &&
      String(product.category) !== currentCategory
    ) {
      return false;
    }

    const price = getProductPrice(product);

    if (minPrice !== "" && price < Number(minPrice)) {
      return false;
    }

    if (maxPrice !== "" && price > Number(maxPrice)) {
      return false;
    }

    return true;
  });

  if (!filtered.length) {
    container.innerHTML = `
      <div class="empty">
        <h3>No products found</h3>
        <p>Try another search or filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {

    const price = getProductPrice(product);
    const mrp = getProductMrp(product);
    const stock = getProductStock(product);

    return `
      <article class="product">

        <img
          src="${escapeAttribute(getProductImage(product))}"
          alt="${escapeAttribute(product.name || "Product")}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/600x600?text=Product'"
        >

        <div class="product-body">

          <div class="product-category">
            ${escapeHtml(product.category || "Product")}
          </div>

          <div class="product-name">
            ${escapeHtml(product.name || "Unnamed Product")}
          </div>

          <div>
            <span class="price">
              ₹${money(price)}
            </span>

            ${
              mrp > price
              ? `<span class="mrp">₹${money(mrp)}</span>`
              : ""
            }
          </div>

          <div class="stock">
            ${
              stock > 0
              ? `${stock} available`
              : "Out of stock"
            }
          </div>

        </div>

        <div class="product-actions">

          <button
            class="add-btn"
            onclick="addToCart('${escapeAttribute(String(product.id))}')"
            ${stock <= 0 ? "disabled" : ""}
          >
            Add to Cart
          </button>

          <button
            class="buy-btn"
            onclick="buyNow('${escapeAttribute(String(product.id))}')"
            ${stock <= 0 ? "disabled" : ""}
          >
            Buy Now
          </button>

        </div>

      </article>
    `;
  }).join("");
}

/* -----------------------------
   Cart
----------------------------- */

function loadLocalCart() {
  try {
    const saved =
      JSON.parse(
        localStorage.getItem("blurancy_cartify_cart") || "[]"
      );

    cart = Array.isArray(saved) ? saved : [];

  } catch {
    cart = [];
  }

  validateLocalCart();
}

function saveLocalCart() {
  localStorage.setItem(
    "blurancy_cartify_cart",
    JSON.stringify(cart)
  );
}

function validateLocalCart() {
  cart = cart
    .map(item => {

      const product =
        products.find(
          p => String(p.id) === String(item.id)
        );

      if (!product) {
        return null;
      }

      const stock = getProductStock(product);

      let quantity =
        Number.parseInt(item.quantity, 10);

      if (!Number.isInteger(quantity) || quantity < 1) {
        quantity = 1;
      }

      if (stock > 0) {
        quantity = Math.min(quantity, stock);
      }

      return {
        id: product.id,
        quantity
      };
    })
    .filter(Boolean);

  saveLocalCart();
}

function addToCart(productId) {
  const product =
    products.find(
      p => String(p.id) === String(productId)
    );

  if (!product) {
    toast("Product not found.");
    return;
  }

  const stock = getProductStock(product);

  if (stock <= 0) {
    toast("Product is out of stock.");
    return;
  }

  const existing =
    cart.find(
      item => String(item.id) === String(product.id)
    );

  if (existing) {

    if (existing.quantity >= stock) {
      toast("Maximum available quantity reached.");
      return;
    }

    existing.quantity += 1;

  } else {

    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveLocalCart();
  updateCartCount();

  toast("Added to cart.");
}

function buyNow(productId) {
  addToCart(productId);
  openCart();
}

function changeQuantity(productId, amount) {

  const item =
    cart.find(
      x => String(x.id) === String(productId)
    );

  const product =
    products.find(
      p => String(p.id) === String(productId)
    );

  if (!item || !product) {
    return;
  }

  const stock = getProductStock(product);

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart =
      cart.filter(
        x => String(x.id) !== String(productId)
      );
  } else if (stock > 0 && item.quantity > stock) {
    item.quantity = stock;
    toast("Stock limit reached.");
  }

  saveLocalCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {

  cart =
    cart.filter(
      x => String(x.id) !== String(productId)
    );

  saveLocalCart();
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const count =
    cart.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );

  $("cartCount").textContent = count;
}

function getCartItems() {

  return cart
    .map(item => {

      const product =
        products.find(
          p => String(p.id) === String(item.id)
        );

      if (!product) {
        return null;
      }

      return {
        product,
        quantity: Number(item.quantity)
      };
    })
    .filter(Boolean);
}

function calculateCart() {

  const items = getCartItems();

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        getProductPrice(item.product) *
        item.quantity,
      0
    );

  return {
    subtotal,
    discount: 0,
    total: subtotal
  };
}

function renderCart() {

  const container = $("cartItems");
  const items = getCartItems();

  if (!items.length) {

    container.innerHTML = `
      <div class="empty">
        Your cart is empty.
      </div>
    `;

    $("cartSubtotal").textContent = "0";
    $("cartDiscount").textContent = "0";
    $("cartTotal").textContent = "0";

    return;
  }

  container.innerHTML =
    items.map(({ product, quantity }) => {

      const price =
        getProductPrice(product);

      return `
        <div class="cart-item">

          <img
            src="${escapeAttribute(getProductImage(product))}"
            alt="${escapeAttribute(product.name || "Product")}"
          >

          <div class="cart-info">

            <strong>
              ${escapeHtml(product.name || "Product")}
            </strong>

            <div>
              ₹${money(price)}
            </div>

            <div class="quantity">

              <button
                onclick="changeQuantity('${escapeAttribute(String(product.id))}', -1)"
              >
                −
              </button>

              <strong>${quantity}</strong>

              <button
                onclick="changeQuantity('${escapeAttribute(String(product.id))}', 1)"
              >
                +
              </button>

            </div>

            <button
              class="remove"
              onclick="removeFromCart('${escapeAttribute(String(product.id))}')"
            >
              Remove
            </button>

          </div>

        </div>
      `;

    }).join("");

  const totals = calculateCart();

  $("cartSubtotal").textContent =
    money(totals.subtotal);

  $("cartDiscount").textContent =
    money(totals.discount);

  $("cartTotal").textContent =
    money(totals.total);
}

function openCart() {
  renderCart();
  openModal("cartModal");
}

/* -----------------------------
   Supabase Auth / OTP
----------------------------- */

async function loadCurrentUser() {

  const {
    data,
    error
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error(error);
    return;
  }

  currentUser = data.session?.user || null;

  updateAccountUI();
}

function updateAccountUI() {

  if (currentUser) {

    $("loggedOutView").classList.add("hidden");
    $("loggedInView").classList.remove("hidden");

    const phone =
      currentUser.phone || "Logged in";

    $("accountPhone").textContent =
      `Phone: ${phone}`;

    $("accountBtn").textContent = "Account";

  } else {

    $("loggedOutView").classList.remove("hidden");
    $("loggedInView").classList.add("hidden");

    $("accountBtn").textContent = "Login";
  }
}

async function sendOtp() {

  const phone =
    $("phoneInput").value.trim();

  if (!validPhone(phone)) {
    toast("Enter a valid 10-digit Indian mobile number.");
    return;
  }

  try {

    const {
      error
    } =
      await supabaseClient.auth.signInWithOtp({
        phone: `+91${phone}`
      });

    if (error) {
      throw error;
    }

    $("otpArea").classList.remove("hidden");

    toast("OTP sent.");

  } catch (error) {

    console.error(error);

    toast(
      error.message ||
      "Unable to send OTP."
    );
  }
}

async function verifyOtp() {

  const phone =
    $("phoneInput").value.trim();

  const token =
    $("otpInput").value.trim();

  if (!validPhone(phone)) {
    toast("Invalid phone number.");
    return;
  }

  if (!/^\d{6}$/.test(token)) {
    toast("Enter the 6-digit OTP.");
    return;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.verifyOtp({
        phone: `+91${phone}`,
        token,
        type: "sms"
      });

    if (error) {
      throw error;
    }

    currentUser =
      data.user || null;

    updateAccountUI();

    toast("Login successful.");

  } catch (error) {

    console.error(error);

    toast(
      error.message ||
      "OTP verification failed."
    );
  }
}

async function logout() {

  const {
    error
  } =
    await supabaseClient.auth.signOut();

  if (error) {
    toast(error.message);
    return;
  }

  currentUser = null;

  updateAccountUI();

  closeModal("accountModal");

  toast("Logged out.");
}

/* -----------------------------
   Checkout
----------------------------- */

function openCheckout() {

  if (!cart.length) {
    toast("Your cart is empty.");
    return;
  }

  if (!currentUser) {

    closeModal("cartModal");
    openModal("accountModal");

    toast("Login before checkout.");

    return;
  }

  closeModal("cartModal");
  openModal("checkoutModal");
}

async function placeOrder(event) {

  event.preventDefault();

  if (!currentUser) {
    toast("Please login.");
    return;
  }

  const houseNo =
    $("houseNo").value.trim();

  const street =
    $("street").value.trim();

  const city =
    $("city").value.trim();

  const pincode =
    $("pincode").value.trim();

  const paymentMethod =
    $("paymentMethod").value;

  if (!houseNo || !street || !city) {
    toast("Complete your address.");
    return;
  }

  if (!validPin(pincode)) {
    toast("Enter a valid 6-digit PIN code.");
    return;
  }

  const items =
    getCartItems().map(({ product, quantity }) => ({
      product_id: product.id,
      quantity
    }));

  if (!items.length) {
    toast("Cart is empty.");
    return;
  }

  /*
    ONLINE PAYMENT MUST GO THROUGH YOUR SECURE BACKEND.

    Never create or verify a live PayU payment using
    secret credentials in this browser code.
  */

  if (
    paymentMethod === "ONLINE" &&
    !API_BASE_URL
  ) {
    toast(
      "Online payment backend is not connected yet."
    );
    return;
  }

  try {

    if (paymentMethod === "COD") {

      await createSupabaseOrder({
        items,
        houseNo,
        street,
        city,
        pincode,
        paymentMethod: "COD"
      });

      cart = [];
      saveLocalCart();
      updateCartCount();

      closeModal("checkoutModal");

      toast("Order placed successfully.");

      await loadOrders();

      return;
    }

    /*
      Online payment:
      secure backend creates the payment order.
    */

    const result =
      await backendRequest(
        "/api/orders/upi",
        {
          method: "POST",
          body: JSON.stringify({
            customer: {
              phone:
                currentUser.phone
                  ? currentUser.phone.replace("+91", "")
                  : ""
            },
            address: {
              houseNo,
              street,
              city,
              pincode
            },
            items
          })
        }
      );

    /*
      For the web version, the backend should return
      the official hosted-payment URL.

      Example:
      result.paymentUrl
    */

    if (!result.paymentUrl) {
      throw new Error(
        "Payment URL was not returned by the secure backend."
      );
    }

    window.location.href =
      result.paymentUrl;

  } catch (error) {

    console.error(error);

    toast(
      error.message ||
      "Unable to place order."
    );
  }
}

/* -----------------------------
   Supabase order creation
----------------------------- */

async function createSupabaseOrder({
  items,
  houseNo,
  street,
  city,
  pincode,
  paymentMethod
}) {

  /*
    This section assumes your database has an
    "orders" table and an "order_items" table.

    If your final SQL uses different names,
    those exact names must be matched here.
  */

  const totals =
    calculateCart();

  const {
    data: order,
    error: orderError
  } =
    await supabaseClient
      .from("orders")
      .insert({
        user_id: currentUser.id,
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.total,
        payment_method: paymentMethod,
        payment_status:
          paymentMethod === "COD"
            ? "pending"
            : "pending",
        status: "pending",
        house_no: houseNo,
        street,
        city,
        pincode
      })
      .select()
      .single();

  if (orderError) {
    throw orderError;
  }

  const orderItems =
    getCartItems().map(({ product, quantity }) => ({
      order_id: order.id,
      product_id: product.id,
      quantity,
      unit_price: getProductPrice(product)
    }));

  const {
    error: itemsError
  } =
    await supabaseClient
      .from("order_items")
      .insert(orderItems);

  if (itemsError) {
    throw itemsError;
  }

  return order;
}

/* -----------------------------
   Orders
----------------------------- */

async function loadOrders() {

  const container =
    $("ordersList");

  if (!currentUser) {

    container.innerHTML =
      "<p>Please login to view orders.</p>";

    return;
  }

  container.innerHTML =
    "<p>Loading orders...</p>";

  try {

    const {
      data,
      error
    } =
      await supabaseClient
        .from("orders")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", {
          ascending: false
        });

    if (error) {
      throw error;
    }

    if (!data?.length) {

      container.innerHTML =
        "<p>No orders yet.</p>";

      return;
    }

    container.innerHTML =
      data.map(order => `
        <div class="order">

          <strong>
            Order #${escapeHtml(String(order.id))}
          </strong>

          <div>
            Total:
            ₹${money(order.total)}
          </div>

          <div>
            Payment:
            ${escapeHtml(order.payment_method || "-")}
          </div>

          <span class="status">
            ${escapeHtml(order.status || "pending")}
          </span>

        </div>
      `).join("");

  } catch (error) {

    console.error(error);

    container.innerHTML =
      `<p>${escapeHtml(error.message)}</p>`;
  }
}

/* -----------------------------
   Search / Filters
----------------------------- */

$("searchForm").addEventListener(
  "submit",
  event => {

    event.preventDefault();

    currentSearch =
      $("searchInput").value.trim();

    renderProducts();
  }
);

$("categoryFilter").addEventListener(
  "change",
  event => {

    currentCategory =
      event.target.value;

    renderProducts();
  }
);

$("filterBtn").addEventListener(
  "click",
  () => {

    minPrice =
      $("minPrice").value;

    maxPrice =
      $("maxPrice").value;

    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      toast("Minimum price cannot exceed maximum price.");
      return;
    }

    renderProducts();
  }
);

/* -----------------------------
   Buttons
----------------------------- */

$("accountBtn").addEventListener(
  "click",
  () => {
    updateAccountUI();
    openModal("accountModal");
  }
);

$("ordersBtn").addEventListener(
  "click",
  async () => {

    openModal("ordersModal");

    await loadOrders();
  }
);

$("cartBtn").addEventListener(
  "click",
  openCart
);

$("sendOtpBtn").addEventListener(
  "click",
  sendOtp
);

$("verifyOtpBtn").addEventListener(
  "click",
  verifyOtp
);

$("logoutBtn").addEventListener(
  "click",
  logout
);

$("checkoutBtn").addEventListener(
  "click",
  openCheckout
);

$("checkoutForm").addEventListener(
  "submit",
  placeOrder
);

/* Close buttons */

document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {
        closeModal(
          button.dataset.close
        );
      }
    );

  });

/* Close modal by clicking outside */

document
  .querySelectorAll(".modal")
  .forEach(modal => {

    modal.addEventListener(
      "click",
      event => {

        if (event.target === modal) {
          modal.classList.remove("show");
        }

      }
    );

  });

/* -----------------------------
   Supabase auth state
----------------------------- */

supabaseClient.auth.onAuthStateChange(
  (_event, session) => {

    currentUser =
      session?.user || null;

    updateAccountUI();
  }
);

/* -----------------------------
   Security helpers
----------------------------- */

function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

/* -----------------------------
   Start application
----------------------------- */

async function init() {

  loadLocalCart();

  updateCartCount();

  await loadCurrentUser();

  await loadProducts();

  updateCartCount();
}

init();
```
