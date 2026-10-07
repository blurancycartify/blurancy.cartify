```javascript
"use strict";

/* =========================
   BLURANCY CARTIFY
   ========================= */

// Supabase settings
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XW68RVEL3u7sRrHiZ0PoFQ_gTmfvncj";

// Add your real backend URL later for PayU checkout.
// Do NOT put PayU secret/salt in this file.
const API_BASE_URL = "YOUR_BACKEND_URL";

let supabaseClient = null;

if (
    typeof window.supabase !== "undefined" &&
    SUPABASE_URL &&
    !SUPABASE_URL.includes("YOUR_SUPABASE")
) {
    supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );
}


/* =========================
   PRODUCT CATALOG
   ========================= */

const products = [
    {id:1,name:"Wireless Bluetooth Earbuds",category:"Electronics",price:999,oldPrice:1999},
    {id:2,name:"Smart Watch",category:"Electronics",price:1499,oldPrice:2999},
    {id:3,name:"Cotton T-Shirt",category:"Fashion",price:499,oldPrice:999},
    {id:4,name:"Running Shoes",category:"Fashion",price:1299,oldPrice:2499},
    {id:5,name:"LED Desk Lamp",category:"Home",price:699,oldPrice:1299},
    {id:6,name:"Portable Bluetooth Speaker",category:"Electronics",price:1199,oldPrice:2199},
    {id:7,name:"USB-C Fast Charger",category:"Electronics",price:799,oldPrice:1499},
    {id:8,name:"Braided USB-C Cable",category:"Electronics",price:299,oldPrice:599},
    {id:9,name:"Universal Phone Stand",category:"Electronics",price:249,oldPrice:499},
    {id:10,name:"Premium Phone Case",category:"Electronics",price:399,oldPrice:799},

    {id:11,name:"Wireless Keyboard",category:"Computers",price:899,oldPrice:1599},
    {id:12,name:"Wireless Mouse",category:"Computers",price:499,oldPrice:899},
    {id:13,name:"Laptop Backpack",category:"Computers",price:999,oldPrice:1999},
    {id:14,name:"USB Hub 4-Port",category:"Computers",price:599,oldPrice:999},
    {id:15,name:"Laptop Cooling Pad",category:"Computers",price:799,oldPrice:1299},

    {id:16,name:"Men's Casual Shirt",category:"Fashion",price:699,oldPrice:1299},
    {id:17,name:"Men's Regular Fit Jeans",category:"Fashion",price:1199,oldPrice:2199},
    {id:18,name:"Women's Casual Top",category:"Fashion",price:599,oldPrice:1199},
    {id:19,name:"Women's Denim Jeans",category:"Fashion",price:1299,oldPrice:2399},
    {id:20,name:"Hooded Sweatshirt",category:"Fashion",price:899,oldPrice:1699},

    {id:21,name:"Men's Running Shoes",category:"Footwear",price:1399,oldPrice:2799},
    {id:22,name:"Women's Walking Shoes",category:"Footwear",price:1299,oldPrice:2499},
    {id:23,name:"Casual Sneakers",category:"Footwear",price:1099,oldPrice:2199},
    {id:24,name:"Comfort Slippers",category:"Footwear",price:399,oldPrice:799},
    {id:25,name:"Sports Sandals",category:"Footwear",price:699,oldPrice:1299},

    {id:26,name:"Travel Backpack",category:"Bags",price:1199,oldPrice:2299},
    {id:27,name:"Laptop Bag",category:"Bags",price:899,oldPrice:1799},
    {id:28,name:"Women's Handbag",category:"Bags",price:999,oldPrice:1999},
    {id:29,name:"Travel Duffle Bag",category:"Bags",price:1099,oldPrice:2199},
    {id:30,name:"School Backpack",category:"Bags",price:799,oldPrice:1499},

    {id:31,name:"Face Wash",category:"Beauty",price:249,oldPrice:399},
    {id:32,name:"Moisturizing Face Cream",category:"Beauty",price:349,oldPrice:599},
    {id:33,name:"Shampoo",category:"Beauty",price:299,oldPrice:499},
    {id:34,name:"Hair Conditioner",category:"Beauty",price:329,oldPrice:549},
    {id:35,name:"Body Lotion",category:"Beauty",price:279,oldPrice:499},

    {id:36,name:"Stainless Steel Water Bottle",category:"Home",price:499,oldPrice:899},
    {id:37,name:"Non-Stick Frying Pan",category:"Home",price:899,oldPrice:1599},
    {id:38,name:"Kitchen Storage Container Set",category:"Home",price:699,oldPrice:1199},
    {id:39,name:"Electric Kettle",category:"Home",price:999,oldPrice:1699},
    {id:40,name:"Stainless Steel Lunch Box",category:"Home",price:449,oldPrice:799},
    {id:41,name:"Decorative Wall Clock",category:"Home",price:599,oldPrice:999},
    {id:42,name:"Artificial Indoor Plant",category:"Home",price:399,oldPrice:699},
    {id:43,name:"Decorative Cushion Set",category:"Home",price:699,oldPrice:1199},
    {id:44,name:"LED String Lights",category:"Home",price:299,oldPrice:599},
    {id:45,name:"LED Table Lamp",category:"Home",price:699,oldPrice:1299},

    {id:46,name:"Premium Basmati Rice 5kg",category:"Grocery",price:699,oldPrice:899},
    {id:47,name:"Wheat Flour 5kg",category:"Grocery",price:299,oldPrice:399},
    {id:48,name:"Toor Dal 1kg",category:"Grocery",price:159,oldPrice:199},
    {id:49,name:"Organic Green Tea",category:"Grocery",price:249,oldPrice:399},
    {id:50,name:"Mixed Dry Fruits 500g",category:"Grocery",price:599,oldPrice:899},

    {id:51,name:"Yoga Mat",category:"Fitness",price:499,oldPrice:899},
    {id:52,name:"Adjustable Dumbbell",category:"Fitness",price:1499,oldPrice:2499},
    {id:53,name:"Resistance Band Set",category:"Fitness",price:399,oldPrice:699},
    {id:54,name:"Sports Water Bottle",category:"Fitness",price:349,oldPrice:599},
    {id:55,name:"Fitness Skipping Rope",category:"Fitness",price:249,oldPrice:449},

    {id:56,name:"Hardcover Notebook",category:"Books",price:199,oldPrice:299},
    {id:57,name:"Ball Pen Pack",category:"Books",price:99,oldPrice:149},
    {id:58,name:"Geometry Box",category:"Books",price:149,oldPrice:249},
    {id:59,name:"Study Planner",category:"Books",price:179,oldPrice:299},
    {id:60,name:"Sticky Notes Set",category:"Books",price:129,oldPrice:199},

    {id:61,name:"Gaming Mouse",category:"Gaming",price:699,oldPrice:1299},
    {id:62,name:"Gaming Keyboard",category:"Gaming",price:1299,oldPrice:2299},
    {id:63,name:"Gaming Headset",category:"Gaming",price:999,oldPrice:1799},
    {id:64,name:"RGB Gaming Mouse Pad",category:"Gaming",price:599,oldPrice:999},
    {id:65,name:"Mobile Gaming Controller",category:"Gaming",price:899,oldPrice:1599},

    {id:66,name:"Building Blocks Set",category:"Toys",price:499,oldPrice:899},
    {id:67,name:"Remote Control Car",category:"Toys",price:799,oldPrice:1499},
    {id:68,name:"Educational Puzzle Set",category:"Toys",price:299,oldPrice:499},
    {id:69,name:"Kids Drawing Kit",category:"Toys",price:349,oldPrice:599},
    {id:70,name:"Soft Teddy Bear",category:"Toys",price:599,oldPrice:999},

    {id:71,name:"Car Phone Holder",category:"Automotive",price:349,oldPrice:599},
    {id:72,name:"Car Cleaning Kit",category:"Automotive",price:499,oldPrice:899},
    {id:73,name:"Car Seat Cushion",category:"Automotive",price:699,oldPrice:1199},
    {id:74,name:"Bike Phone Holder",category:"Automotive",price:299,oldPrice:499},
    {id:75,name:"Car Emergency Tool Kit",category:"Automotive",price:999,oldPrice:1599},

    {id:76,name:"Hard Shell Cabin Luggage",category:"Travel",price:1799,oldPrice:2999},
    {id:77,name:"Travel Neck Pillow",category:"Travel",price:399,oldPrice:699},
    {id:78,name:"Passport Holder",category:"Travel",price:249,oldPrice:499},
    {id:79,name:"Travel Organizer Pouch",category:"Travel",price:299,oldPrice:499},
    {id:80,name:"Foldable Travel Bag",category:"Travel",price:499,oldPrice:899},

    {id:81,name:"Gardening Tool Set",category:"Garden",price:599,oldPrice:999},
    {id:82,name:"Plant Watering Can",category:"Garden",price:299,oldPrice:499},
    {id:83,name:"Outdoor Camping Tent",category:"Garden",price:1999,oldPrice:3499},
    {id:84,name:"LED Solar Garden Light",category:"Garden",price:399,oldPrice:699},
    {id:85,name:"Outdoor Folding Chair",category:"Garden",price:899,oldPrice:1499},

    {id:86,name:"Pet Feeding Bowl",category:"Pet",price:249,oldPrice:399},
    {id:87,name:"Pet Grooming Brush",category:"Pet",price:199,oldPrice:349},
    {id:88,name:"Pet Collar",category:"Pet",price:149,oldPrice:299},
    {id:89,name:"Pet Toy Ball",category:"Pet",price:129,oldPrice:249},
    {id:90,name:"Pet Travel Bag",category:"Pet",price:899,oldPrice:1499},

    {id:91,name:"Office Desk Organizer",category:"Office",price:349,oldPrice:599},
    {id:92,name:"Ergonomic Office Chair",category:"Office",price:4999,oldPrice:7999},
    {id:93,name:"LED Desk Light",category:"Office",price:599,oldPrice:999},
    {id:94,name:"Document File Organizer",category:"Office",price:249,oldPrice:399},
    {id:95,name:"A4 Printer Paper Pack",category:"Office",price:399,oldPrice:499},

    {id:96,name:"Classic Analog Watch",category:"Accessories",price:999,oldPrice:1999},
    {id:97,name:"Sunglasses",category:"Accessories",price:499,oldPrice:999},
    {id:98,name:"Leather Wallet",category:"Accessories",price:399,oldPrice:799},
    {id:99,name:"Gift Hamper",category:"Gifts",price:799,oldPrice:1299},
    {id:100,name:"Premium Gift Box",category:"Gifts",price:599,oldPrice:999}
];


/* =========================
   STATE
   ========================= */

let cart = [];
let selectedCategory = "All";
let currentSearch = "";
let currentSort = "default";
let currentProduct = null;


/* =========================
   HELPERS
   ========================= */

function $(id) {
    return document.getElementById(id);
}

function money(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function productImage(product) {
    return (
        "https://placehold.co/600x450/png?text=" +
        encodeURIComponent(product.name)
    );
}

function getDiscount(product) {
    if (!product.oldPrice || product.oldPrice <= product.price) {
        return 0;
    }

    return Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
    );
}


/* =========================
   PRODUCT DISPLAY
   ========================= */

function getFilteredProducts() {
    let result = products.filter(function(product) {
        const categoryMatch =
            selectedCategory === "All" ||
            product.category.toLowerCase() === selectedCategory.toLowerCase();

        const searchText =
            (product.name + " " + product.category).toLowerCase();

        const searchMatch =
            !currentSearch ||
            searchText.includes(currentSearch.toLowerCase());

        return categoryMatch && searchMatch;
    });

    if (currentSort === "price-low") {
        result.sort(function(a, b) {
            return a.price - b.price;
        });
    }

    if (currentSort === "price-high") {
        result.sort(function(a, b) {
            return b.price - a.price;
        });
    }

    if (currentSort === "name") {
        result.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }

    return result;
}

function renderProducts() {
    const grid = $("productGrid");
    const noProducts = $("noProducts");
    const resultText = $("productResultText");

    if (!grid) {
        console.error("productGrid element was not found.");
        return;
    }

    const filteredProducts = getFilteredProducts();

    grid.innerHTML = "";

    if (resultText) {
        resultText.textContent =
            filteredProducts.length +
            " product" +
            (filteredProducts.length === 1 ? "" : "s") +
            " found";
    }

    if (filteredProducts.length === 0) {
        if (noProducts) {
            noProducts.classList.remove("hidden");
        }
        return;
    }

    if (noProducts) {
        noProducts.classList.add("hidden");
    }

    filteredProducts.forEach(function(product) {
        const discount = getDiscount(product);

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img
                    src="${productImage(product)}"
                    alt="${escapeHtml(product.name)}"
                    loading="lazy"
                >
            </div>

            <div class="product-card-content">
                <div class="product-category">
                    ${escapeHtml(product.category)}
                </div>

                <h3>${escapeHtml(product.name)}</h3>

                <div class="product-price">
                    <strong>${money(product.price)}</strong>
                    ${
                        product.oldPrice
                            ? `<span class="old-price">${money(product.oldPrice)}</span>`
                            : ""
                    }
                    ${
                        discount
                            ? `<span class="discount">${discount}% OFF</span>`
                            : ""
                    }
                </div>

                <div class="product-actions">
                    <button
                        type="button"
                        class="view-product-btn"
                        data-id="${product.id}"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="add-cart-btn"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });

    grid.querySelectorAll(".view-product-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            openProductModal(Number(button.dataset.id));
        });
    });

    grid.querySelectorAll(".add-cart-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            addToCart(Number(button.dataset.id));
        });
    });
}


/* =========================
   PRODUCT MODAL
   ========================= */

function openProductModal(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    currentProduct = product;

    const details = $("productDetails");

    if (!details) {
        return;
    }

    const discount = getDiscount(product);

    details.innerHTML = `
        <div class="product-detail">
            <img
                src="${productImage(product)}"
                alt="${escapeHtml(product.name)}"
            >

            <div>
                <div class="product-category">
                    ${escapeHtml(product.category)}
                </div>

                <h2>${escapeHtml(product.name)}</h2>

                <p>
                    <strong>${money(product.price)}</strong>
                    ${
                        product.oldPrice
                            ? `<span class="old-price">${money(product.oldPrice)}</span>`
                            : ""
                    }
                </p>

                ${
                    discount
                        ? `<p>${discount}% discount</p>`
                        : ""
                }

                <button
                    type="button"
                    id="modalAddCartBtn"
                    class="add-cart-btn"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    const modal = $("productModal");

    if (modal) {
        modal.classList.remove("hidden");
    }

    const addButton = $("modalAddCartBtn");

    if (addButton) {
        addButton.addEventListener("click", function() {
            addToCart(product.id);
        });
    }
}


/* =========================
   CART
   ========================= */

function loadCart() {
    try {
        const saved = localStorage.getItem("blurancy_cart");

        if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                cart = parsed
                    .filter(function(item) {
                        return (
                            item &&
                            Number.isInteger(Number(item.id)) &&
                            Number(item.quantity) > 0
                        );
                    })
                    .map(function(item) {
                        return {
                            id: Number(item.id),
                            quantity: Math.max(1, Number(item.quantity))
                        };
                    });
            }
        }
    } catch (error) {
        console.error("Could not load cart:", error);
        cart = [];
    }

    saveCart();
}

function saveCart() {
    localStorage.setItem("blurancy_cart", JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const existing = cart.find(function(item) {
        return item.id === productId;
    });

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    updateCartCount();

    alert(product.name + " added to cart.");
}

function removeFromCart(productId) {
    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    saveCart();
    renderCart();
    updateCartCount();
}

function changeQuantity(productId, amount) {
    const item = cart.find(function(cartItem) {
        return cartItem.id === productId;
    });

    if (!item) {
        return;
    }

    item.quantity += amount;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderCart();
    updateCartCount();
}

function getCartDetails() {
    let subtotal = 0;
    let quantity = 0;

    const validItems = [];

    cart.forEach(function(item) {
        const product = products.find(function(productItem) {
            return productItem.id === item.id;
        });

        if (!product) {
            return;
        }

        const itemQuantity = Math.max(1, Number(item.quantity));
        const itemTotal = product.price * itemQuantity;

        subtotal += itemTotal;
        quantity += itemQuantity;

        validItems.push({
            product: product,
            quantity: itemQuantity,
            total: itemTotal
        });
    });

    return {
        items: validItems,
        subtotal: subtotal,
        quantity: quantity
    };
}

function renderCart() {
    const cartItems = $("cartItems");

    if (!cartItems) {
        return;
    }

    const details = getCartDetails();

    cartItems.innerHTML = "";

    if (details.items.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;
    } else {
        details.items.forEach(function(item) {
            const row = document.createElement("div");
            row.className = "cart-item";

            row.innerHTML = `
                <div>
                    <strong>${escapeHtml(item.product.name)}</strong>
                    <div>${money(item.product.price)}</div>
                </div>

                <div class="cart-quantity">
                    <button
                        type="button"
                        class="quantity-minus"
                        data-id="${item.product.id}"
                    >
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="quantity-plus"
                        data-id="${item.product.id}"
                    >
                        +
                    </button>
                </div>

                <div>
                    ${money(item.total)}
                </div>

                <button
                    type="button"
                    class="remove-cart-item"
                    data-id="${item.product.id}"
                >
                    Remove
                </button>
            `;

            cartItems.appendChild(row);
        });

        cartItems.querySelectorAll(".quantity-minus").forEach(function(button) {
            button.addEventListener("click", function() {
                changeQuantity(Number(button.dataset.id), -1);
            });
        });

        cartItems.querySelectorAll(".quantity-plus").forEach(function(button) {
            button.addEventListener("click", function() {
                changeQuantity(Number(button.dataset.id), 1);
            });
        });

        cartItems.querySelectorAll(".remove-cart-item").forEach(function(button) {
            button.addEventListener("click", function() {
                removeFromCart(Number(button.dataset.id));
            });
        });
    }

    const subtotal = details.subtotal;
    const discount = 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const gst = Math.round(taxableAmount * 0.18);
    const total = taxableAmount + gst;

    if ($("cartSubtotal")) {
        $("cartSubtotal").textContent = money(subtotal);
    }

    if ($("cartDiscount")) {
        $("cartDiscount").textContent = money(discount);
    }

    if ($("cartGST")) {
        $("cartGST").textContent = money(gst);
    }

    if ($("cartTotal")) {
        $("cartTotal").textContent = money(total);
    }

    if ($("checkoutTotal")) {
        $("checkoutTotal").textContent = money(total);
    }
}

function updateCartCount() {
    const count = cart.reduce(function(total, item) {
        return total + Number(item.quantity || 0);
    }, 0);

    const cartCount = $("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


/* =========================
   CART DRAWER
   ========================= */

function openCart() {
    const drawer = $("cartDrawer");

    if (drawer) {
        drawer.classList.remove("hidden");
    }

    renderCart();
}

function closeCart() {
    const drawer = $("cartDrawer");

    if (drawer) {
        drawer.classList.add("hidden");
    }
}


/* =========================
   SEARCH
   ========================= */

function setupSearch() {
    const form = $("searchForm");
    const input = $("searchInput");

    if (!form || !input) {
        return;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        currentSearch = input.value.trim();
        renderProducts();
    });
}


/* =========================
   CATEGORY FILTER
   ========================= */

function setupCategories() {
    document.querySelectorAll("[data-category]").forEach(function(button) {
        button.addEventListener("click", function() {
            selectedCategory = button.dataset.category || "All";

            document.querySelectorAll("[data-category]").forEach(function(item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            renderProducts();
        });
    });
}


/* =========================
   SORT
   ========================= */

function setupSort() {
    const sortSelect = $("sortSelect");

    if (!sortSelect) {
        return;
    }

    sortSelect.addEventListener("change", function() {
        currentSort = sortSelect.value;
        renderProducts();
    });
}


/* =========================
   LOGIN / OTP
   ========================= */

async function sendOtp() {
    const phoneInput = $("phoneInput");
    const loginMessage = $("loginMessage");

    if (!phoneInput) {
        return;
    }

    const phone = phoneInput.value.trim();

    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
        if (loginMessage) {
            loginMessage.textContent =
                "Enter a valid phone number with country code.";
        }
        return;
    }

    if (!supabaseClient) {
        if (loginMessage) {
            loginMessage.textContent =
                "Supabase is not configured yet.";
        }
        return;
    }

    try {
        const { error } = await supabaseClient.auth.signInWithOtp({
            phone: phone
        });

        if (error) {
            throw error;
        }

        if (loginMessage) {
            loginMessage.textContent =
                "OTP sent successfully. Check your SMS.";
        }

        if ($("otpInput")) {
            $("otpInput").classList.remove("hidden");
        }

        if ($("verifyOtpBtn")) {
            $("verifyOtpBtn").classList.remove("hidden");
        }
    } catch (error) {
        console.error(error);

        if (loginMessage) {
            loginMessage.textContent =
                error.message || "Could not send OTP.";
        }
    }
}

async function verifyOtp() {
    const phoneInput = $("phoneInput");
    const otpInput = $("otpInput");
    const loginMessage = $("loginMessage");

    if (!phoneInput || !otpInput || !supabaseClient) {
        return;
    }

    const phone = phoneInput.value.trim();
    const token = otpInput.value.trim();

    if (!token) {
        if (loginMessage) {
            loginMessage.textContent = "Enter the OTP.";
        }
        return;
    }

    try {
        const { error } = await supabaseClient.auth.verifyOtp({
            phone: phone,
            token: token,
            type: "sms"
        });

        if (error) {
            throw error;
        }

        if (loginMessage) {
            loginMessage.textContent = "Login successful.";
        }

        updateAuthUI();

        setTimeout(function() {
            const modal = $("loginModal");

            if (modal) {
                modal.classList.add("hidden");
            }
        }, 700);

    } catch (error) {
        console.error(error);

        if (loginMessage) {
            loginMessage.textContent =
                error.message || "Invalid OTP.";
        }
    }
}

async function logoutUser() {
    if (!supabaseClient) {
        return;
    }

    try {
        await supabaseClient.auth.signOut();
        updateAuthUI();
    } catch (error) {
        console.error(error);
    }
}

async function updateAuthUI() {
    if (!supabaseClient) {
        return;
    }

    try {
        const { data } = await supabaseClient.auth.getSession();

        const session = data ? data.session : null;

        const loginBtn = $("loginBtn");
        const logoutBtn = $("logoutBtn");

        if (loginBtn) {
            loginBtn.classList.toggle("hidden", !!session);
        }

        if (logoutBtn) {
            logoutBtn.classList.toggle("hidden", !session);
        }
    } catch (error) {
        console.error(error);
    }
}


/* =========================
   CHECKOUT
   ========================= */

function openCheckout() {
    const details = getCartDetails();

    if (details.items.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const modal = $("checkoutModal");

    if (modal) {
        modal.classList.remove("hidden");
    }

    renderCart();
}

function closeCheckout() {
    const modal = $("checkoutModal");

    if (modal) {
        modal.classList.add("hidden");
    }
}

async function submitCheckout(event) {
    event.preventDefault();

    const message = $("checkoutMessage");
    const details = getCartDetails();

    if (details.items.length === 0) {
        if (message) {
            message.textContent = "Your cart is empty.";
        }
        return;
    }

    if (!API_BASE_URL || API_BASE_URL.includes("YOUR_BACKEND")) {
        if (message) {
            message.textContent =
                "Payment backend is not configured yet. PayU live checkout cannot be started from this frontend alone.";
        }
        return;
    }

    const form = $("checkoutForm");

    if (!form) {
        return;
    }

    const formData = new FormData(form);

    const payload = {
        customer: {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            address: formData.get("address"),
            pincode: formData.get("pincode")
        },
        items: details.items.map(function(item) {
            return {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            };
        }),
        subtotal: details.subtotal
    };

    try {
        if (message) {
            message.textContent = "Creating secure payment...";
        }

        const response = await fetch(
            API_BASE_URL + "/api/create-payment",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) {
            throw new Error("Payment server returned an error.");
        }

        const result = await response.json();

        if (result.paymentUrl) {
            window.location.href = result.paymentUrl;
            return;
        }

        if (message) {
            message.textContent =
                "Payment session was not returned by the server.";
        }

    } catch (error) {
        console.error(error);

        if (message) {
            message.textContent =
                error.message || "Could not start payment.";
        }
    }
}


/* =========================
   INFO MODALS
   ========================= */

const infoContent = {
    about: `
        <h2>About Blurancy Cartify</h2>
        <p>
            Blurancy Cartify is an online shopping project with
            products, search, categories, cart and checkout features.
        </p>
    `,

    contact: `
        <h2>Contact</h2>
        <p>
            Please add your official customer-support email,
            phone number and business address here before publishing.
        </p>
    `,

    privacy: `
        <h2>Privacy Policy</h2>
        <p>
            Customer information should be collected and stored
            securely. Add your final privacy policy before accepting
            real customer orders.
        </p>
    `,

    terms: `
        <h2>Terms & Conditions</h2>
        <p>
            Add your final terms, delivery policy, return policy,
            refund policy and payment conditions before going live.
        </p>
    `
};

function openInfoModal(type) {
    const modal = $("infoModal");
    const content = $("infoContent");

    if (!modal || !content) {
        return;
    }

    content.innerHTML =
        infoContent[type] ||
        "<p>Information not available.</p>";

    modal.classList.remove("hidden");
}


/* =========================
   MODAL CLOSE HELPERS
   ========================= */

function closeModalById(id) {
    const modal = $(id);

    if (modal) {
        modal.classList.add("hidden");
    }
}


/* =========================
   START APPLICATION
   ========================= */

document.addEventListener("DOMContentLoaded", function() {
    console.log(
        "Blurancy Cartify loaded successfully. Products:",
        products.length
    );

    loadCart();

    renderProducts();
    renderCart();
    updateCartCount();

    setupSearch();
    setupCategories();
    setupSort();

    /* Cart button */
    const cartBtn = $("cartBtn");

    if (cartBtn) {
        cartBtn.addEventListener("click", openCart);
    }

    /* Close cart */
    const closeCartBtn = $("closeCartBtn");

    if (closeCartBtn) {
        closeCartBtn.addEventListener("click", closeCart);
    }

    /* Login */
    const loginBtn = $("loginBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function() {
            const modal = $("loginModal");

            if (modal) {
                modal.classList.remove("hidden");
            }
        });
    }

    /* Logout */
    const logoutBtn = $("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logoutUser);
    }

    /* Send OTP */
    const sendOtpBtn = $("sendOtpBtn");

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener("click", sendOtp);
    }

    /* Verify OTP */
    const verifyOtpBtn = $("verifyOtpBtn");

    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener("click", verifyOtp);
    }

    /* Back to phone */
    const backToPhoneBtn = $("backToPhoneBtn");

    if (backToPhoneBtn) {
        backToPhoneBtn.addEventListener("click", function() {
            if ($("otpInput")) {
                $("otpInput").value = "";
            }

            if ($("loginMessage")) {
                $("loginMessage").textContent = "";
            }
        });
    }

    /* Checkout */
    const checkoutBtn = $("checkoutBtn");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", openCheckout);
    }

    const checkoutForm = $("checkoutForm");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", submitCheckout);
    }

    /* Shop now */
    const shopNowBtn = $("shopNowBtn");

    if (shopNowBtn) {
        shopNowBtn.addEventListener("click", function() {
            const productsSection =
                document.querySelector("#products");

            if (productsSection) {
                productsSection.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }

    /* Product modal close */
    document.querySelectorAll("[data-close-product-modal]").forEach(
        function(button) {
            button.addEventListener("click", function() {
                closeModalById("productModal");
            });
        }
    );

    /* Info buttons */
    document.querySelectorAll("[data-info]").forEach(function(button) {
        button.addEventListener("click", function() {
            openInfoModal(button.dataset.info);
        });
    });

    /* Generic close buttons */
    document.querySelectorAll("[data-close-modal]").forEach(
        function(button) {
            button.addEventListener("click", function() {
                const modalId = button.dataset.closeModal;

                if (modalId) {
                    closeModalById(modalId);
                }
            });
        }
    );

    /* Close modals when clicking outside */
    document.querySelectorAll(".modal").forEach(function(modal) {
        modal.addEventListener("click", function(event) {
            if (event.target === modal) {
                modal.classList.add("hidden");
            }
        });
    });

    /* Update login state if Supabase is configured */
    if (supabaseClient) {
        updateAuthUI();

        supabaseClient.auth.onAuthStateChange(function() {
            updateAuthUI();
        });
    }
});
```
