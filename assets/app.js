const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XW68RVEL3u7sRrHiZ0PoFQ_gTmfvncj";

const API_BASE_URL = "YOUR_BACKEND_URL";  "use strict";

/*
 * BLURANCY CARTIFY
 * Frontend application
 *
 * Includes:
 * - 100 products
 * - Product display
 * - Search
 * - Category filtering
 * - Sorting
 * - Product details
 * - Cart
 * - Quantity controls
 * - Login with Supabase Phone OTP
 * - Logout
 * - Checkout form
 * - PayU backend connection
 */

/* =========================================================
   CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XW68RVEL3u7sRrHiZ0PoFQ_gTmfvncj";

/*
 * IMPORTANT:
 * Replace this with your DEPLOYED backend URL.
 *
 * Example:
 * https://your-backend.example.com
 *
 * Do NOT put the PayU merchant salt here.
 */
const API_BASE_URL = "YOUR_BACKEND_URL";


/* =========================================================
   SUPABASE
   ========================================================= */

let supabaseClient = null;

if (
    window.supabase &&
    SUPABASE_URL &&
    SUPABASE_URL !== "YOUR_SUPABASE_PROJECT_URL" &&
    SUPABASE_PUBLISHABLE_KEY
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}


/* =========================================================
   PRODUCT DATABASE
   ========================================================= */

const products = [
    { id: 1, name: "Wireless Bluetooth Earbuds", category: "Electronics", price: 999, oldPrice: 1999 },
    { id: 2, name: "Smart Watch", category: "Electronics", price: 1499, oldPrice: 2999 },
    { id: 3, name: "Cotton T-Shirt", category: "Fashion", price: 499, oldPrice: 999 },
    { id: 4, name: "Running Shoes", category: "Fashion", price: 1299, oldPrice: 2499 },
    { id: 5, name: "LED Desk Lamp", category: "Home", price: 699, oldPrice: 1299 },
    { id: 6, name: "Portable Bluetooth Speaker", category: "Electronics", price: 1199, oldPrice: 2199 },
    { id: 7, name: "USB-C Fast Charger", category: "Electronics", price: 799, oldPrice: 1499 },
    { id: 8, name: "Braided USB-C Cable", category: "Electronics", price: 299, oldPrice: 599 },
    { id: 9, name: "Universal Phone Stand", category: "Electronics", price: 249, oldPrice: 499 },
    { id: 10, name: "Premium Phone Case", category: "Electronics", price: 399, oldPrice: 799 },

    { id: 11, name: "Wireless Keyboard", category: "Computers", price: 899, oldPrice: 1599 },
    { id: 12, name: "Wireless Mouse", category: "Computers", price: 499, oldPrice: 899 },
    { id: 13, name: "Laptop Backpack", category: "Computers", price: 999, oldPrice: 1999 },
    { id: 14, name: "USB Hub 4-Port", category: "Computers", price: 599, oldPrice: 999 },
    { id: 15, name: "Laptop Cooling Pad", category: "Computers", price: 799, oldPrice: 1299 },

    { id: 16, name: "Men's Casual Shirt", category: "Fashion", price: 699, oldPrice: 1299 },
    { id: 17, name: "Men's Regular Fit Jeans", category: "Fashion", price: 1199, oldPrice: 2199 },
    { id: 18, name: "Women's Casual Top", category: "Fashion", price: 599, oldPrice: 1199 },
    { id: 19, name: "Women's Denim Jeans", category: "Fashion", price: 1299, oldPrice: 2399 },
    { id: 20, name: "Hooded Sweatshirt", category: "Fashion", price: 899, oldPrice: 1699 },

    { id: 21, name: "Men's Running Shoes", category: "Footwear", price: 1399, oldPrice: 2799 },
    { id: 22, name: "Women's Walking Shoes", category: "Footwear", price: 1299, oldPrice: 2499 },
    { id: 23, name: "Casual Sneakers", category: "Footwear", price: 1099, oldPrice: 2199 },
    { id: 24, name: "Comfort Slippers", category: "Footwear", price: 399, oldPrice: 799 },
    { id: 25, name: "Sports Sandals", category: "Footwear", price: 699, oldPrice: 1299 },

    { id: 26, name: "Travel Backpack", category: "Bags", price: 1199, oldPrice: 2299 },
    { id: 27, name: "Laptop Bag", category: "Bags", price: 899, oldPrice: 1799 },
    { id: 28, name: "Women's Handbag", category: "Bags", price: 999, oldPrice: 1999 },
    { id: 29, name: "Travel Duffle Bag", category: "Bags", price: 1099, oldPrice: 2199 },
    { id: 30, name: "School Backpack", category: "Bags", price: 799, oldPrice: 1499 },

    { id: 31, name: "Face Wash", category: "Beauty", price: 249, oldPrice: 399 },
    { id: 32, name: "Moisturizing Face Cream", category: "Beauty", price: 349, oldPrice: 599 },
    { id: 33, name: "Shampoo", category: "Beauty", price: 299, oldPrice: 499 },
    { id: 34, name: "Hair Conditioner", category: "Beauty", price: 329, oldPrice: 549 },
    { id: 35, name: "Body Lotion", category: "Beauty", price: 279, oldPrice: 499 },

    { id: 36, name: "Stainless Steel Water Bottle", category: "Home", price: 499, oldPrice: 899 },
    { id: 37, name: "Non-Stick Frying Pan", category: "Home", price: 899, oldPrice: 1599 },
    { id: 38, name: "Kitchen Storage Container Set", category: "Home", price: 699, oldPrice: 1199 },
    { id: 39, name: "Electric Kettle", category: "Home", price: 999, oldPrice: 1699 },
    { id: 40, name: "Stainless Steel Lunch Box", category: "Home", price: 449, oldPrice: 799 },

    { id: 41, name: "Decorative Wall Clock", category: "Home", price: 599, oldPrice: 999 },
    { id: 42, name: "Artificial Indoor Plant", category: "Home", price: 399, oldPrice: 699 },
    { id: 43, name: "Decorative Cushion Set", category: "Home", price: 699, oldPrice: 1199 },
    { id: 44, name: "LED String Lights", category: "Home", price: 299, oldPrice: 599 },
    { id: 45, name: "LED Table Lamp", category: "Home", price: 699, oldPrice: 1299 },

    { id: 46, name: "Premium Basmati Rice 5kg", category: "Grocery", price: 699, oldPrice: 899 },
    { id: 47, name: "Wheat Flour 5kg", category: "Grocery", price: 299, oldPrice: 399 },
    { id: 48, name: "Toor Dal 1kg", category: "Grocery", price: 159, oldPrice: 199 },
    { id: 49, name: "Organic Green Tea", category: "Grocery", price: 249, oldPrice: 399 },
    { id: 50, name: "Mixed Dry Fruits 500g", category: "Grocery", price: 599, oldPrice: 899 },

    { id: 51, name: "Yoga Mat", category: "Fitness", price: 499, oldPrice: 899 },
    { id: 52, name: "Adjustable Dumbbell", category: "Fitness", price: 1499, oldPrice: 2499 },
    { id: 53, name: "Resistance Band Set", category: "Fitness", price: 399, oldPrice: 699 },
    { id: 54, name: "Sports Water Bottle", category: "Fitness", price: 349, oldPrice: 599 },
    { id: 55, name: "Fitness Skipping Rope", category: "Fitness", price: 249, oldPrice: 449 },

    { id: 56, name: "Hardcover Notebook", category: "Books", price: 199, oldPrice: 299 },
    { id: 57, name: "Ball Pen Pack", category: "Books", price: 99, oldPrice: 149 },
    { id: 58, name: "Geometry Box", category: "Books", price: 149, oldPrice: 249 },
    { id: 59, name: "Study Planner", category: "Books", price: 179, oldPrice: 299 },
    { id: 60, name: "Sticky Notes Set", category: "Books", price: 129, oldPrice: 199 },

    { id: 61, name: "Gaming Mouse", category: "Gaming", price: 699, oldPrice: 1299 },
    { id: 62, name: "Gaming Keyboard", category: "Gaming", price: 1299, oldPrice: 2299 },
    { id: 63, name: "Gaming Headset", category: "Gaming", price: 999, oldPrice: 1799 },
    { id: 64, name: "RGB Gaming Mouse Pad", category: "Gaming", price: 599, oldPrice: 999 },
    { id: 65, name: "Mobile Gaming Controller", category: "Gaming", price: 899, oldPrice: 1599 },

    { id: 66, name: "Building Blocks Set", category: "Toys", price: 499, oldPrice: 899 },
    { id: 67, name: "Remote Control Car", category: "Toys", price: 799, oldPrice: 1499 },
    { id: 68, name: "Educational Puzzle Set", category: "Toys", price: 299, oldPrice: 499 },
    { id: 69, name: "Kids Drawing Kit", category: "Toys", price: 349, oldPrice: 599 },
    { id: 70, name: "Soft Teddy Bear", category: "Toys", price: 599, oldPrice: 999 },

    { id: 71, name: "Car Phone Holder", category: "Automotive", price: 349, oldPrice: 599 },
    { id: 72, name: "Car Cleaning Kit", category: "Automotive", price: 499, oldPrice: 899 },
    { id: 73, name: "Car Seat Cushion", category: "Automotive", price: 699, oldPrice: 1199 },
    { id: 74, name: "Bike Phone Holder", category: "Automotive", price: 299, oldPrice: 499 },
    { id: 75, name: "Car Emergency Tool Kit", category: "Automotive", price: 999, oldPrice: 1599 },

    { id: 76, name: "Hard Shell Cabin Luggage", category: "Travel", price: 1799, oldPrice: 2999 },
    { id: 77, name: "Travel Neck Pillow", category: "Travel", price: 399, oldPrice: 699 },
    { id: 78, name: "Passport Holder", category: "Travel", price: 249, oldPrice: 499 },
    { id: 79, name: "Travel Organizer Pouch", category: "Travel", price: 299, oldPrice: 499 },
    { id: 80, name: "Foldable Travel Bag", category: "Travel", price: 499, oldPrice: 899 },

    { id: 81, name: "Gardening Tool Set", category: "Garden", price: 599, oldPrice: 999 },
    { id: 82, name: "Plant Watering Can", category: "Garden", price: 299, oldPrice: 499 },
    { id: 83, name: "Outdoor Camping Tent", category: "Garden", price: 1999, oldPrice: 3499 },
    { id: 84, name: "LED Solar Garden Light", category: "Garden", price: 399, oldPrice: 699 },
    { id: 85, name: "Outdoor Folding Chair", category: "Garden", price: 899, oldPrice: 1499 },

    { id: 86, name: "Pet Feeding Bowl", category: "Pet", price: 249, oldPrice: 399 },
    { id: 87, name: "Pet Grooming Brush", category: "Pet", price: 199, oldPrice: 349 },
    { id: 88, name: "Pet Collar", category: "Pet", price: 149, oldPrice: 299 },
    { id: 89, name: "Pet Toy Ball", category: "Pet", price: 129, oldPrice: 249 },
    { id: 90, name: "Pet Travel Bag", category: "Pet", price: 899, oldPrice: 1499 },

    { id: 91, name: "Office Desk Organizer", category: "Office", price: 349, oldPrice: 599 },
    { id: 92, name: "Ergonomic Office Chair", category: "Office", price: 4999, oldPrice: 7999 },
    { id: 93, name: "LED Desk Light", category: "Office", price: 599, oldPrice: 999 },
    { id: 94, name: "Document File Organizer", category: "Office", price: 249, oldPrice: 399 },
    { id: 95, name: "A4 Printer Paper Pack", category: "Office", price: 399, oldPrice: 499 },

    { id: 96, name: "Classic Analog Watch", category: "Accessories", price: 999, oldPrice: 1999 },
    { id: 97, name: "Sunglasses", category: "Accessories", price: 499, oldPrice: 999 },
    { id: 98, name: "Leather Wallet", category: "Accessories", price: 399, oldPrice: 799 },
    { id: 99, name: "Gift Hamper", category: "Gifts", price: 799, oldPrice: 1299 },
    { id: 100, name: "Premium Gift Box", category: "Gifts", price: 599, oldPrice: 999 }
];


/* =========================================================
   APPLICATION STATE
   ========================================================= */

let cart = loadCart();

let selectedCategory = "All";
let currentSearch = "";
let currentSort = "default";
let currentProduct = null;


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function money(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(value) || 0);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   PRODUCT IMAGES
   ========================================================= */

function productImage(product) {
    const text = encodeURIComponent(product.name);

    return `https://placehold.co/600x450/png?text=${text}`;
}


/* =========================================================
   PRODUCT FILTERING
   ========================================================= */

function getVisibleProducts() {

    let result = products.filter(product => {

        const categoryMatch =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const searchText =
            `${product.name} ${product.category}`.toLowerCase();

        const searchMatch =
            !currentSearch ||
            searchText.includes(currentSearch.toLowerCase());

        return categoryMatch && searchMatch;
    });

    if (currentSort === "price-low") {
        result.sort((a, b) => a.price - b.price);
    }

    if (currentSort === "price-high") {
        result.sort((a, b) => b.price - a.price);
    }

    if (currentSort === "name") {
        result.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    return result;
}


/* =========================================================
   DISPLAY PRODUCTS
   ========================================================= */

function renderProducts() {

    const grid = $("productGrid");
    const empty = $("noProducts");
    const resultText = $("productResultText");

    if (!grid) return;

    const visibleProducts = getVisibleProducts();

    grid.innerHTML = "";

    if (visibleProducts.length === 0) {

        empty?.classList.remove("hidden");

        if (resultText) {
            resultText.textContent = "No products found";
        }

        return;
    }

    empty?.classList.add("hidden");

    if (resultText) {
        resultText.textContent =
            `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} available`;
    }

    visibleProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        const discount = product.oldPrice > product.price
            ? Math.round(
                ((product.oldPrice - product.price) /
                    product.oldPrice) * 100
            )
            : 0;

        card.innerHTML = `
            <div class="product-image-wrapper">
                <img
                    class="product-image"
                    src="${productImage(product)}"
                    alt="${escapeHtml(product.name)}"
                    loading="lazy"
                >

                ${
                    discount > 0
                        ? `<span class="discount-badge">${discount}% OFF</span>`
                        : ""
                }
            </div>

            <div class="product-card-body">

                <div class="product-category">
                    ${escapeHtml(product.category)}
                </div>

                <h3 class="product-name">
                    ${escapeHtml(product.name)}
                </h3>

                <div class="product-price">
                    <strong>${money(product.price)}</strong>
                    ${
                        product.oldPrice
                            ? `<del>${money(product.oldPrice)}</del>`
                            : ""
                    }
                </div>

                <div class="product-actions">

                    <button
                        class="secondary-btn view-product-btn"
                        type="button"
                        data-product-id="${product.id}"
                    >
                        View
                    </button>

                    <button
                        class="primary-btn add-cart-btn"
                        type="button"
                        data-product-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        grid.appendChild(card);
    });
}


/* =========================================================
   CART STORAGE
   ========================================================= */

function loadCart() {

    try {

        const saved =
            localStorage.getItem("blurancy_cart");

        if (!saved) return [];

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(item => {
                return (
                    Number.isInteger(Number(item.id)) &&
                    Number(item.quantity) > 0 &&
                    products.some(
                        product =>
                            product.id === Number(item.id)
                    )
                );
            })
            .map(item => ({
                id: Number(item.id),
                quantity: Math.min(
                    99,
                    Math.max(1, Number(item.quantity))
                )
            }));

    } catch (error) {

        console.error("Cart loading error:", error);

        return [];
    }
}


function saveCart() {

    localStorage.setItem(
        "blurancy_cart",
        JSON.stringify(cart)
    );
}


/* =========================================================
   CART FUNCTIONS
   ========================================================= */

function findProduct(id) {

    return products.find(
        product => product.id === Number(id)
    );
}


function addToCart(id, quantity = 1) {

    const product = findProduct(id);

    if (!product) {
        showMessage("Product is unavailable.");
        return;
    }

    quantity = Number(quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        quantity = 1;
    }

    const existing = cart.find(
        item => item.id === product.id
    );

    if (existing) {

        existing.quantity = Math.min(
            99,
            existing.quantity + quantity
        );

    } else {

        cart.push({
            id: product.id,
            quantity
        });
    }

    saveCart();

    renderCart();

    openCart();

    showMessage(`${product.name} added to cart.`);
}


function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== Number(id)
    );

    saveCart();

    renderCart();
}


function changeQuantity(id, change) {

    const item = cart.find(
        cartItem => cartItem.id === Number(id)
    );

    if (!item) return;

    item.quantity += Number(change);

    if (item.quantity <= 0) {
        removeFromCart(id);
        return;
    }

    item.quantity = Math.min(
        99,
        item.quantity
    );

    saveCart();

    renderCart();
}


function getCartDetails() {

    const items = [];

    for (const item of cart) {

        const product = findProduct(item.id);

        if (!product) continue;

        const quantity =
            Math.min(
                99,
                Math.max(1, Number(item.quantity))
            );

        items.push({
            product,
            quantity,
            lineTotal: product.price * quantity
        });
    }

    return items;
}


function getCartSubtotal() {

    return getCartDetails().reduce(
        (total, item) =>
            total + item.lineTotal,
        0
    );
}


function getCartDiscount() {

    return getCartDetails().reduce(
        (total, item) => {

            const discount =
                Math.max(
                    0,
                    item.product.oldPrice -
                    item.product.price
                );

            return total + discount * item.quantity;
        },
        0
    );
}


/*
 * GST is calculated on the selling-price subtotal.
 * The exact GST treatment can vary by product/category,
 * so the backend should remain authoritative for final
 * payment calculations.
 */
function getCartGst() {

    const subtotal = getCartSubtotal();

    return subtotal * 0.18;
}


function getCartTotal() {

    return (
        getCartSubtotal() +
        getCartGst()
    );
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

    const cartItems = $("cartItems");

    if (!cartItems) return;

    const details = getCartDetails();

    const itemCount =
        details.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    const subtotal = getCartSubtotal();
    const discount = getCartDiscount();
    const gst = getCartGst();
    const total = getCartTotal();

    if ($("cartCount")) {
        $("cartCount").textContent =
            String(itemCount);
    }

    if ($("cartSubtotal")) {
        $("cartSubtotal").textContent =
            money(subtotal);
    }

    if ($("cartDiscount")) {
        $("cartDiscount").textContent =
            money(discount);
    }

    if ($("cartGst")) {
        $("cartGst").textContent =
            money(gst);
    }

    if ($("cartTotal")) {
        $("cartTotal").textContent =
            money(total);
    }

    if ($("checkoutTotal")) {
        $("checkoutTotal").textContent =
            money(total);
    }

    if (details.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add products to your cart to continue.</p>
            </div>
        `;

        return;
    }

    cartItems.innerHTML = details.map(item => {

        const product = item.product;

        return `
            <div class="cart-item">

                <img
                    src="${productImage(product)}"
                    alt="${escapeHtml(product.name)}"
                    class="cart-item-image"
                >

                <div class="cart-item-details">

                    <h4>
                        ${escapeHtml(product.name)}
                    </h4>

                    <p>
                        ${money(product.price)}
                    </p>

                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="quantity-btn"
                            data-cart-action="decrease"
                            data-product-id="${product.id}"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            class="quantity-btn"
                            data-cart-action="increase"
                            data-product-id="${product.id}"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="remove-cart-btn"
                        data-cart-action="remove"
                        data-product-id="${product.id}"
                    >
                        Remove
                    </button>

                </div>

                <strong class="cart-item-total">
                    ${money(item.lineTotal)}
                </strong>

            </div>
        `;

    }).join("");
}


/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {

    $("cartDrawer")?.classList.add("open");
    $("cartOverlay")?.classList.remove("hidden");

    document.body.classList.add("cart-open");
}


function closeCart() {

    $("cartDrawer")?.classList.remove("open");
    $("cartOverlay")?.classList.add("hidden");

    document.body.classList.remove("cart-open");
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
}


function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.add("hidden");

    const openModalCount =
        document.querySelectorAll(
            ".modal:not(.hidden)"
        ).length;

    if (openModalCount === 0) {
        document.body.classList.remove("modal-open");
    }
}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

function showProductDetails(id) {

    const product = findProduct(id);

    if (!product) {
        showMessage("Product not found.");
        return;
    }

    currentProduct = product;

    const discount = product.oldPrice > product.price
        ? Math.round(
            ((product.oldPrice - product.price) /
                product.oldPrice) * 100
        )
        : 0;

    const container = $("productDetails");

    if (!container) return;

    container.innerHTML = `

        <div class="product-detail">

            <img
                src="${productImage(product)}"
                alt="${escapeHtml(product.name)}"
                class="product-detail-image"
            >

            <div class="product-detail-info">

                <div class="product-category">
                    ${escapeHtml(product.category)}
                </div>

                <h2>
                    ${escapeHtml(product.name)}
                </h2>

                <div class="product-price detail-price">

                    <strong>
                        ${money(product.price)}
                    </strong>

                    ${
                        product.oldPrice
                            ? `<del>${money(product.oldPrice)}</del>`
                            : ""
                    }

                </div>

                ${
                    discount > 0
                        ? `<p>${discount}% discount</p>`
                        : ""
                }

                <p>
                    This product is available from
                    Blurancy Cartify.
                </p>

                <button
                    type="button"
                    class="primary-btn full-width"
                    id="detailAddCartBtn"
                >
                    Add to Cart
                </button>

            </div>

        </div>
    `;

    $("detailAddCartBtn")?.addEventListener(
        "click",
        () => {

            addToCart(product.id);

            closeModal("productModal");
        }
    );

    openModal("productModal");
}


/* =========================================================
   LOGIN / LOGOUT
   ========================================================= */

function showLoginModal() {

    $("loginMessage").textContent = "";

    $("phoneLoginStep")?.classList.remove("hidden");
    $("otpLoginStep")?.classList.add("hidden");

    openModal("loginModal");
}


function showLoginMessage(message, error = false) {

    const element = $("loginMessage");

    if (!element) return;

    element.textContent = message;

    element.classList.toggle(
        "error",
        Boolean(error)
    );
}


async function sendOtp() {

    if (!supabaseClient) {

        showLoginMessage(
            "Supabase is not configured. Add your Supabase Project URL in app.js.",
            true
        );

        return;
    }

    const phone =
        $("phoneInput")?.value.trim();

    if (!phone) {

        showLoginMessage(
            "Enter your phone number.",
            true
        );

        return;
    }

    const button = $("sendOtpBtn");

    if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
    }

    try {

        const { error } =
            await supabaseClient.auth.signInWithOtp({
                phone
            });

        if (error) {
            throw error;
        }

        $("phoneLoginStep")?.classList.add("hidden");
        $("otpLoginStep")?.classList.remove("hidden");

        showLoginMessage(
            "OTP sent. Enter the OTP you received."
        );

    } catch (error) {

        console.error(error);

        showLoginMessage(
            error?.message ||
            "Unable to send OTP.",
            true
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = "Send OTP";
        }
    }
}


async function verifyOtp() {

    if (!supabaseClient) {

        showLoginMessage(
            "Supabase is not configured.",
            true
        );

        return;
    }

    const phone =
        $("phoneInput")?.value.trim();

    const token =
        $("otpInput")?.value.trim();

    if (!phone || !token) {

        showLoginMessage(
            "Enter the phone number and OTP.",
            true
        );

        return;
    }

    const button = $("verifyOtpBtn");

    if (button) {
        button.disabled = true;
        button.textContent = "Verifying...";
    }

    try {

        const { data, error } =
            await supabaseClient.auth.verifyOtp({
                phone,
                token,
                type: "sms"
            });

        if (error) {
            throw error;
        }

        if (!data?.session) {
            throw new Error(
                "Login session was not created."
            );
        }

        closeModal("loginModal");

        updateAuthUI(data.session.user);

        showMessage("Login successful.");

    } catch (error) {

        console.error(error);

        showLoginMessage(
            error?.message ||
            "Invalid or expired OTP.",
            true
        );

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent = "Verify OTP";
        }
    }
}


async function logout() {

    if (!supabaseClient) {
        updateAuthUI(null);
        return;
    }

    try {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            throw error;
        }

        updateAuthUI(null);

        showMessage("You have been logged out.");

    } catch (error) {

        console.error(error);

        showMessage(
            error?.message ||
            "Logout failed."
        );
    }
}


function updateAuthUI(user) {

    const loginBtn = $("loginBtn");
    const logoutBtn = $("logoutBtn");
    const userStatus = $("userStatus");

    if (user) {

        loginBtn?.classList.add("hidden");
        logoutBtn?.classList.remove("hidden");
        userStatus?.classList.remove("hidden");

        if (userStatus) {

            const phone =
                user.phone ||
                user.email ||
                "Logged in";

            userStatus.textContent =
                `Logged in: ${phone}`;
        }

        const checkoutPhone =
            $("checkoutPhone");

        if (
            checkoutPhone &&
            user.phone &&
            !checkoutPhone.value
        ) {
            checkoutPhone.value =
                user.phone;
        }

    } else {

        loginBtn?.classList.remove("hidden");
        logoutBtn?.classList.add("hidden");
        userStatus?.classList.add("hidden");

        if (userStatus) {
            userStatus.textContent = "";
        }
    }
}


async function loadCurrentUser() {

    if (!supabaseClient) {

        updateAuthUI(null);

        return;
    }

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            throw error;
        }

        updateAuthUI(
            data?.session?.user || null
        );

    } catch (error) {

        console.error(
            "Session error:",
            error
        );

        updateAuthUI(null);
    }

    supabaseClient.auth.onAuthStateChange(
        (_event, session) => {

            updateAuthUI(
                session?.user || null
            );
        }
    );
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function getCheckoutData() {

    return {
        name: $("checkoutName")?.value.trim() || "",
        email: $("checkoutEmail")?.value.trim() || "",
        phone: $("checkoutPhone")?.value.trim() || "",
        address: $("checkoutAddress")?.value.trim() || "",
        pincode: $("checkoutPincode")?.value.trim() || ""
    };
}


function validateCheckout(data) {

    if (!data.name) {
        return "Enter your full name.";
    }

    if (
        !data.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
        return "Enter a valid email address.";
    }

    if (
        !data.phone ||
        data.phone.replace(/\D/g, "").length < 10
    ) {
        return "Enter a valid phone number.";
    }

    if (!data.address) {
        return "Enter your delivery address.";
    }

    if (!/^\d{6}$/.test(data.pincode)) {
        return "Enter a valid 6-digit PIN code.";
    }

    if (getCartDetails().length === 0) {
        return "Your cart is empty.";
    }

    return "";
}


async function startPayUCheckout(event) {

    event.preventDefault();

    const message = $("checkoutMessage");
    const button = $("payNowBtn");

    if (message) {
        message.textContent = "";
        message.classList.remove("error");
    }

    const data = getCheckoutData();

    const validationError =
        validateCheckout(data);

    if (validationError) {

        if (message) {
            message.textContent =
                validationError;

            message.classList.add("error");
        }

        return;
    }

    if (
        !API_BASE_URL ||
        API_BASE_URL ===
        "YOUR_BACKEND_URL"
    ) {

        if (message) {

            message.textContent =
                "Payment backend is not configured yet. Add your deployed backend URL in assets/app.js.";

            message.classList.add("error");
        }

        return;
    }

    if (button) {
        button.disabled = true;
        button.textContent = "Creating payment...";
    }

    try {

        /*
         * Only product IDs and quantities are sent.
         *
         * The backend must calculate the authoritative
         * amount using its own product database.
         */
        const items = getCartDetails().map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }));

        const response = await fetch(
            `${API_BASE_URL.replace(/\/$/, "")}/api/payu/create-payment`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    customer: data,
                    items
                })
            }
        );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result?.error ||
                "Unable to create payment."
            );
        }

        if (
            !result.formAction ||
            !result.fields
        ) {

            throw new Error(
                "Invalid payment response from server."
            );
        }

        submitPayUForm(
            result.formAction,
            result.fields
        );

    } catch (error) {

        console.error(
            "PayU checkout error:",
            error
        );

        if (message) {

            message.textContent =
                error?.message ||
                "Payment could not be started.";

            message.classList.add("error");
        }

    } finally {

        if (button) {
            button.disabled = false;
            button.textContent =
                "Continue to PayU";
        }
    }
}


function submitPayUForm(
    formAction,
    fields
) {

    const form =
        document.createElement("form");

    form.method = "POST";
    form.action = formAction;
    form.style.display = "none";

    Object.entries(fields).forEach(
        ([name, value]) => {

            const input =
                document.createElement("input");

            input.type = "hidden";
            input.name = name;
            input.value =
                value == null
                    ? ""
                    : String(value);

            form.appendChild(input);
        }
    );

    document.body.appendChild(form);

    form.submit();
}


/* =========================================================
   INFO CONTENT
   ========================================================= */

const infoPages = {

    about: `
        <h2>About Blurancy Cartify</h2>
        <p>
            Blurancy Cartify is an online shopping platform
            designed for convenient product discovery,
            cart management and online checkout.
        </p>
    `,

    contact: `
        <h2>Contact Us</h2>
        <p>
            Please use the official contact details
            published by Blurancy Cartify for customer
            support and order assistance.
        </p>
    `,

    privacy: `
        <h2>Privacy Policy</h2>
        <p>
            Customer information should be collected,
            processed and protected according to the
            applicable privacy laws and the published
            Blurancy Cartify privacy policy.
        </p>
    `,

    terms: `
        <h2>Terms & Conditions</h2>
        <p>
            Orders, payments, cancellations, returns and
            other services are subject to the applicable
            Blurancy Cartify terms and conditions.
        </p>
    `,

    refund: `
        <h2>Refund & Return Policy</h2>
        <p>
            Refunds and returns are subject to the
            applicable product and order conditions.
            The final production website should publish
            the complete approved refund policy.
        </p>
    `,

    shipping: `
        <h2>Shipping Policy</h2>
        <p>
            Shipping availability, delivery times and
            charges depend on the order and delivery
            location. The production website should
            publish the complete shipping policy.
        </p>
    `
};


function showInfoPage(type) {

    const content =
        infoPages[type];

    if (!content) return;

    $("infoContent").innerHTML =
        content;

    openModal("infoModal");
}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(message) {

    /*
     * Simple temporary notification.
     * Does not interfere with cart or login.
     */

    let notification =
        document.getElementById(
            "cartifyNotification"
        );

    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "cartifyNotification";

        notification.className =
            "cartify-notification";

        document.body.appendChild(
            notification
        );
    }

    notification.textContent =
        message;

    notification.classList.add("show");

    clearTimeout(
        notification._timer
    );

    notification._timer =
        setTimeout(() => {

            notification.classList.remove(
                "show"
            );

        }, 2500);
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEvents() {

    /* Search */

    $("searchForm")?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            currentSearch =
                $("searchInput")?.value.trim() ||
                "";

            renderProducts();
        }
    );


    /* Categories */

    document
        .querySelectorAll(".category-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-btn"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );

                    button.classList.add(
                        "active"
                    );

                    selectedCategory =
                        button.dataset.category ||
                        "All";

                    renderProducts();
                }
            );
        });


    /* Sorting */

    $("sortSelect")?.addEventListener(
        "change",
        event => {

            currentSort =
                event.target.value;

            renderProducts();
        }
    );


    /* Product buttons */

    $("productGrid")?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");

            if (!button) return;

            const id =
                Number(
                    button.dataset.productId
                );

            if (!id) return;

            if (
                button.classList.contains(
                    "add-cart-btn"
                )
            ) {
                addToCart(id);
            }

            if (
                button.classList.contains(
                    "view-product-btn"
                )
            ) {
                showProductDetails(id);
            }
        }
    );


    /* Cart */

    $("cartBtn")?.addEventListener(
        "click",
        openCart
    );

    $("closeCartBtn")?.addEventListener(
        "click",
        closeCart
    );

    $("cartOverlay")?.addEventListener(
        "click",
        closeCart
    );


    /* Cart item buttons */

    $("cartItems")?.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");

            if (!button) return;

            const id =
                Number(
                    button.dataset.productId
                );

            const action =
                button.dataset.cartAction;

            if (!id || !action) return;

            if (action === "increase") {
                changeQuantity(id, 1);
            }

            if (action === "decrease") {
                changeQuantity(id, -1);
            }

            if (action === "remove") {
                removeFromCart(id);
            }
        }
    );


    /* Login */

    $("loginBtn")?.addEventListener(
        "click",
        showLoginModal
    );

    $("logoutBtn")?.addEventListener(
        "click",
        logout
    );

    $("sendOtpBtn")?.addEventListener(
        "click",
        sendOtp
    );

    $("verifyOtpBtn")?.addEventListener(
        "click",
        verifyOtp
    );


    $("backToPhoneBtn")?.addEventListener(
        "click",
        () => {

            $("otpLoginStep")
                ?.classList.add("hidden");

            $("phoneLoginStep")
                ?.classList.remove("hidden");

            showLoginMessage("");
        }
    );


    /* Checkout */

    $("checkoutBtn")?.addEventListener(
        "click",
        () => {

            if (
                getCartDetails().length === 0
            ) {

                showMessage(
                    "Your cart is empty."
                );

                return;
            }

            renderCart();

            closeCart();

            openModal(
                "checkoutModal"
            );
        }
    );


    $("checkoutForm")?.addEventListener(
        "submit",
        startPayUCheckout
    );


    /* Shop Now */

    $("shopNowBtn")?.addEventListener(
        "click",
        () => {

            document
                .querySelector(
                    ".products-section"
                )
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        }
    );


    /* Home */

    $("homeBtn")?.addEventListener(
        "click",
        event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    /* Modal close buttons */

    document
        .querySelectorAll("[data-close]")
        .forEach(element => {

            element.addEventListener(
                "click",
                () => {

                    closeModal(
                        element.dataset.close
                    );
                }
            );
        });


    /* Footer information */

    document
        .querySelectorAll("[data-info]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    showInfoPage(
                        button.dataset.info
                    );
                }
            );
        });


    /* Escape key */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeCart();

            document
                .querySelectorAll(
                    ".modal:not(.hidden)"
                )
                .forEach(modal => {
                    closeModal(modal.id);
                });
        }
    );
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeApp() {

    renderProducts();

    renderCart();

    setupEvents();

    loadCurrentUser();

    if ($("currentYear")) {
        $("currentYear").textContent =
            new Date().getFullYear();
    }

    console.log(
        `Blurancy Cartify loaded: ${products.length} products`
    );
}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();
}                                                                                                                                           
