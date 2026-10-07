<script src="assets/app.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="assets/app.js"></script>
</body>
</html>
   ```javascript
"use strict";

/* =========================================================
   BLURANCY CARTIFY
   Complete frontend application
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_XW68RVEL3u7sRrHiZ0PoFQ_gTmfvncj";

const API_BASE_URL = "YOUR_BACKEND_URL";


/* =========================================================
   SUPABASE
   ========================================================= */

let supabaseClient = null;

if (
    window.supabase &&
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
   STATE
   ========================================================= */

let cart = loadCart();
let selectedCategory = "All";
let currentSearch = "";
let currentSort = "default";
let currentProduct = null;


/* =========================================================
   HELPERS
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

function showMessage(message) {
    alert(message);
}


/* =========================================================
   PRODUCT IMAGE
   ========================================================= */

function productImage(product) {
    return `https://placehold.co/600x450/png?text=${encodeURIComponent(product.name)}`;
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

        const discount =
            product.oldPrice > product.price
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

                    <strong>
                        ${money(product.price)}
                    </strong>

                    <del>
                        ${money(product.oldPrice)}
                    </del>

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
   PRODUCT DETAILS
   ========================================================= */

function openProductDetails(id) {

    const product = products.find(
        item => item.id === Number(id)
    );

    if (!product) return;

    currentProduct = product;

    const container = $("productDetails");

    if (!container) return;

    container.innerHTML = `
        <img
            class="product-detail-image"
            src="${productImage(product)}"
            alt="${escapeHtml(product.name)}"
        >

        <div class="product-detail-info">

            <div class="product-category">
                ${escapeHtml(product.category)}
            </div>

            <h2>
                ${escapeHtml(product.name)}
            </h2>

            <div class="product-price">
                <strong>${money(product.price)}</strong>
                <del>${money(product.oldPrice)}</del>
            </div>

            <p>
                Quality ${escapeHtml(product.name)}
                available from Blurancy Cartify.
            </p>

            <button
                class="primary-btn full-width"
                type="button"
                id="detailAddCartBtn"
            >
                Add to Cart
            </button>

        </div>
    `;

    $("detailAddCartBtn")?.addEventListener(
        "click",
        () => addToCart(product.id)
    );

    openModal("productModal");
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

        if (!Array.isArray(parsed)) return [];

        return parsed
            .filter(item =>
                Number.isInteger(Number(item.id)) &&
                Number(item.quantity) > 0 &&
                products.some(
                    product =>
                        product.id === Number(item.id)
                )
            )
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
   CART
   ========================================================= */

function findProduct(id) {

    return products.find(
        product => product.id === Number(id)
    );
}

function addToCart(id, quantity = 1) {

    const product = findProduct(id);

    if (!product) {
        showMessage("Product unavailable.");
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

    showMessage(
        `${product.name} added to cart.`
    );
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

    return cart
        .map(item => {

            const product = findProduct(item.id);

            if (!product) return null;

            const quantity = Math.min(
                99,
                Math.max(1, Number(item.quantity))
            );

            return {
                product,
                quantity,
                lineTotal: product.price * quantity
            };
        })
        .filter(Boolean);
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

            return total +
                discount * item.quantity;

        },
        0
    );
}

function getCartGst() {

    return getCartSubtotal() * 0.18;
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

    const container = $("cartItems");
    const count = $("cartCount");

    const subtotalElement = $("cartSubtotal");
    const discountElement = $("cartDiscount");
    const gstElement = $("cartGst");
    const totalElement = $("cartTotal");

    const details = getCartDetails();

    const totalQuantity = details.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    if (count) {
        count.textContent = totalQuantity;
    }

    if (!container) return;

    if (details.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add products to your cart.</p>
            </div>
        `;

    } else {

        container.innerHTML =
            details.map(item => {

                const product = item.product;

                return `
                    <div class="cart-item">

                        <img
                            src="${productImage(product)}"
                            alt="${escapeHtml(product.name)}"
                        >

                        <div class="cart-item-info">

                            <h4>
                                ${escapeHtml(product.name)}
                            </h4>

                            <strong>
                                ${money(product.price)}
                            </strong>

                            <div class="quantity-controls">

                                <button
                                    type="button"
                                    data-cart-minus="${product.id}"
                                >
                                    −
                                </button>

                                <span>
                                    ${item.quantity}
                                </span>

                                <button
                                    type="button"
                                    data-cart-plus="${product.id}"
                                >
                                    +
                                </button>

                            </div>

                            <button
                                type="button"
                                class="remove-cart-btn"
                                data-cart-remove="${product.id}"
                            >
                                Remove
                            </button>

                        </div>

                    </div>
                `;

            }).join("");
    }

    if (subtotalElement) {
        subtotalElement.textContent =
            money(getCartSubtotal());
    }

    if (discountElement) {
        discountElement.textContent =
            money(getCartDiscount());
    }

    if (gstElement) {
        gstElement.textContent =
            money(getCartGst());
    }

    if (totalElement) {
        totalElement.textContent =
            money(getCartTotal());
    }

    const checkoutTotal = $("checkoutTotal");

    if (checkoutTotal) {
        checkoutTotal.textContent =
            money(getCartTotal());
    }
}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.remove("hidden");
}

function closeModal(id) {

    const modal = $(id);

    if (!modal) return;

    modal.classList.add("hidden");
}


/* =========================================================
   CART DRAWER
   ========================================================= */

function openCart() {

    $("cartDrawer")?.classList.add("open");
    $("cartOverlay")?.classList.remove("hidden");
}

function closeCart() {

    $("cartDrawer")?.classList.remove("open");
    $("cartOverlay")?.classList.add("hidden");
}


/* =========================================================
   SEARCH
   ========================================================= */

function handleSearch(event) {

    event.preventDefault();

    currentSearch =
        $("searchInput")?.value.trim() || "";

    renderProducts();
}


/* =========================================================
   CATEGORY
   ========================================================= */

function selectCategory(category) {

    selectedCategory = category;

    document
        .querySelectorAll(".category-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category === category
            );
        });

    renderProducts();
}


/* =========================================================
   LOGIN
   ========================================================= */

async function sendOtp() {

    const phone =
        $("phoneInput")?.value.trim();

    const message =
        $("loginMessage");

    if (!phone) {

        if (message) {
            message.textContent =
                "Enter your phone number.";
        }

        return;
    }

    if (!supabaseClient) {

        if (message) {
            message.textContent =
                "Supabase is not configured yet.";
        }

        return;
    }

    try {

        if (message) {
            message.textContent =
                "Sending OTP...";
        }

        const { error } =
            await supabaseClient.auth.signInWithOtp({
                phone
            });

        if (error) throw error;

        $("phoneLoginStep")
            ?.classList.add("hidden");

        $("otpLoginStep")
            ?.classList.remove("hidden");

        if (message) {
            message.textContent =
                "OTP sent successfully.";
        }

    } catch (error) {

        console.error(error);

        if (message) {
            message.textContent =
                error.message ||
                "Unable to send OTP.";
        }
    }
}

async function verifyOtp() {

    const phone =
        $("phoneInput")?.value.trim();

    const token =
        $("otpInput")?.value.trim();

    const message =
        $("loginMessage");

    if (!phone || !token) {

        if (message) {
            message.textContent =
                "Enter your phone number and OTP.";
        }

        return;
    }

    if (!supabaseClient) {

        if (message) {
            message.textContent =
                "Supabase is not configured.";
        }

        return;
    }

    try {

        if (message) {
            message.textContent =
                "Verifying OTP...";
        }

        const { error } =
            await supabaseClient.auth.verifyOtp({
                phone,
                token,
                type: "sms"
            });

        if (error) throw error;

        closeModal("loginModal");

        updateAuthUI();

        if (message) {
            message.textContent =
                "Login successful.";
        }

    } catch (error) {

        console.error(error);

        if (message) {
            message.textContent =
                error.message ||
                "Invalid OTP.";
        }
    }
}

async function logout() {

    if (!supabaseClient) return;

    try {

        await supabaseClient.auth.signOut();

        updateAuthUI();

        showMessage("Logged out.");

    } catch (error) {

        console.error(error);
    }
}

async function updateAuthUI() {

    if (!supabaseClient) {

        $("loginBtn")
            ?.classList.remove("hidden");

        $("logoutBtn")
            ?.classList.add("hidden");

        return;
    }

    try {

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();

        const loggedIn = Boolean(session);

        $("loginBtn")
            ?.classList.toggle(
                "hidden",
                loggedIn
            );

        $("logoutBtn")
            ?.classList.toggle(
                "hidden",
                !loggedIn
            );

        const status = $("userStatus");

        if (status) {

            if (loggedIn) {

                status.textContent =
                    "You are logged in.";

                status.classList.remove("hidden");

            } else {

                status.classList.add("hidden");
            }
        }

    } catch (error) {

        console.error(
            "Auth UI error:",
            error
        );
    }
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function openCheckout() {

    if (cart.length === 0) {

        showMessage(
            "Your cart is empty."
        );

        return;
    }

    renderCart();

    openModal("checkoutModal");
}

async function handleCheckout(event) {

    event.preventDefault();

    const message =
        $("checkoutMessage");

    const details =
        getCartDetails();

    if (details.length === 0) {

        if (message) {
            message.textContent =
                "Your cart is empty.";
        }

        return;
    }

    const name =
        $("checkoutName")?.value.trim();

    const email =
        $("checkoutEmail")?.value.trim();

    const phone =
        $("checkoutPhone")?.value.trim();

    const address =
        $("checkoutAddress")?.value.trim();

    const pincode =
        $("checkoutPincode")?.value.trim();

    if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !/^\d{6}$/.test(pincode)
    ) {

        if (message) {
            message.textContent =
                "Please enter valid delivery details.";
        }

        return;
    }

    /*
     * IMPORTANT:
     * Real PayU payment must be created by your
     * secure backend.
     *
     * Never place the PayU Salt in this file.
     */

    if (
        !API_BASE_URL ||
        API_BASE_URL === "YOUR_BACKEND_URL"
    ) {

        if (message) {
            message.textContent =
                "Payment backend is not connected yet.";
        }

        return;
    }

    try {

        if (message) {
            message.textContent =
                "Creating secure payment...";
        }

        const response =
            await fetch(
                `${API_BASE_URL}/api/create-payment`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        customer: {
                            name,
                            email,
                            phone,
                            address,
                            pincode
                        },

                        items: details.map(item => ({
                            id: item.product.id,
                            name: item.product.name,
                            quantity: item.quantity
                        }))
                    })
                }
            );

        if (!response.ok) {
            throw new Error(
                "Payment server returned an error."
            );
        }

        const data =
            await response.json();

        if (data.redirectUrl) {

            window.location.href =
                data.redirectUrl;

            return;
        }

        if (message) {
            message.textContent =
                "Payment session was not created.";
        }

    } catch (error) {

        console.error(
            "Checkout error:",
            error
        );

        if (message) {
            message.textContent =
                error.message ||
                "Unable to start payment.";
        }
    }
}


/* =========================================================
   INFORMATION
   ========================================================= */

function showInfo(type) {

    const content =
        $("infoContent");

    if (!content) return;

    const information = {

        about: `
            <h2>About Blurancy Cartify</h2>
            <p>
                Blurancy Cartify is an online shopping platform
                offering products across multiple categories.
            </p>
        `,

        contact: `
            <h2>Contact</h2>
            <p>
                Please add your official customer-support
                contact information before publishing.
            </p>
        `,

        privacy: `
            <h2>Privacy Policy</h2>
            <p>
                Customer information should be collected,
                stored and processed securely.
            </p>
        `,

        terms: `
            <h2>Terms & Conditions</h2>
            <p>
                Orders, payments, delivery and cancellations
                are subject to the applicable terms.
            </p>
        `,

        refund: `
            <h2>Refund & Return</h2>
            <p>
                Refund and return eligibility depends on the
                product and the applicable return policy.
            </p>
        `,

        shipping: `
            <h2>Shipping Policy</h2>
            <p>
                Shipping times and charges depend on the
                delivery location and product.
            </p>
        `
    };

    content.innerHTML =
        information[type] ||
        "<p>Information unavailable.</p>";

    openModal("infoModal");
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* Products */

        renderProducts();

        /* Cart */

        renderCart();

        /* Year */

        const year =
            $("currentYear");

        if (year) {
            year.textContent =
                new Date().getFullYear();
        }

        /* Search */

        $("searchForm")
            ?.addEventListener(
                "submit",
                handleSearch
            );

        /* Sort */

        $("sortSelect")
            ?.addEventListener(
                "change",
                event => {

                    currentSort =
                        event.target.value;

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

                        selectCategory(
                            button.dataset.category
                        );
                    }
                );
            });

        /* Product buttons */

        $("productGrid")
            ?.addEventListener(
                "click",
                event => {

                    const addButton =
                        event.target.closest(
                            ".add-cart-btn"
                        );

                    const viewButton =
                        event.target.closest(
                            ".view-product-btn"
                        );

                    if (addButton) {

                        addToCart(
                            addButton.dataset.productId
                        );

                        return;
                    }

                    if (viewButton) {

                        openProductDetails(
                            viewButton.dataset.productId
                        );
                    }
                }
            );

        /* Cart buttons */

        $("cartItems")
            ?.addEventListener(
                "click",
                event => {

                    const plus =
                        event.target.closest(
                            "[data-cart-plus]"
                        );

                    const minus =
                        event.target.closest(
                            "[data-cart-minus]"
                        );

                    const remove =
                        event.target.closest(
                            "[data-cart-remove]"
                        );

                    if (plus) {

                        changeQuantity(
                            plus.dataset.cartPlus,
                            1
                        );
                    }

                    if (minus) {

                        changeQuantity(
                            minus.dataset.cartMinus,
                            -1
                        );
                    }

                    if (remove) {

                        removeFromCart(
                            remove.dataset.cartRemove
                        );
                    }
                }
            );

        /* Cart */

        $("cartBtn")
            ?.addEventListener(
                "click",
                openCart
            );

        $("closeCartBtn")
            ?.addEventListener(
                "click",
                closeCart
            );

        $("cartOverlay")
            ?.addEventListener(
                "click",
                closeCart
            );

        /* Checkout */

        $("checkoutBtn")
            ?.addEventListener(
                "click",
                openCheckout
            );

        $("checkoutForm")
            ?.addEventListener(
                "submit",
                handleCheckout
            );

        /* Login */

        $("loginBtn")
            ?.addEventListener(
                "click",
                () => {

                    openModal(
                        "loginModal"
                    );
                }
            );

        $("logoutBtn")
            ?.addEventListener(
                "click",
                logout
            );

        $("sendOtpBtn")
            ?.addEventListener(
                "click",
                sendOtp
            );

        $("verifyOtpBtn")
            ?.addEventListener(
                "click",
                verifyOtp
            );

        $("backToPhoneBtn")
            ?.addEventListener(
                "click",
                () => {

                    $("otpLoginStep")
                        ?.classList.add(
                            "hidden"
                        );

                    $("phoneLoginStep")
                        ?.classList.remove(
                            "hidden"
                        );

                    $("loginMessage")
                        && (
                            $("loginMessage")
                                .textContent = ""
                        );
                }
            );

        /* Shop Now */

        $("shopNowBtn")
            ?.addEventListener(
                "click",
                () => {

                    $("productGrid")
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });
                }
            );

        /* Home */

        $("homeBtn")
            ?.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );

        /* Information */

        document
            .querySelectorAll(".footer-link")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        showInfo(
                            button.dataset.info
                        );
                    }
                );
            });

        /* Close modal buttons */

        document
            .querySelectorAll(
                "[data-close]"
            )
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

        /* Authentication state */

        updateAuthUI();

        if (supabaseClient) {

            supabaseClient.auth.onAuthStateChange(
                () => {
                    updateAuthUI();
                }
            );
        }

    }
);
```
