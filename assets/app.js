const SUPABASE_URL = "YOUR_PROJECT_URL";
const SUPABASE_KEY = "YOUR_PUBLISHABLE_OR_ANON_KEY";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
async function loadProducts() {
    const { data, error } = await supabaseClient
        .from("products")
        .select("*");

    if (error) {
        console.error(error);
        return;
    }

    console.log(data);
}

loadProducts();

);
```javascript
/* =========================================================
   BLURANCY CARTIFY
   SUPABASE FRONTEND
   ========================================================= */


/* =========================================================
   1. SUPABASE CONFIGURATION
   ========================================================= */

const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_OR_ANON_KEY_HERE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   2. GLOBAL VARIABLES
   ========================================================= */

let products = [];
let cart = JSON.parse(localStorage.getItem("blurancy_cart") || "[]");

let currentSearch = "";


/* =========================================================
   3. PAGE ELEMENTS
   ========================================================= */

const productsGrid = document.getElementById("productsGrid");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const searchInput = document.getElementById("searchInput");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const cartModal = document.getElementById("cartModal");
const loginModal = document.getElementById("loginModal");

const loginBtn = document.getElementById("loginBtn");
const cartBtn = document.getElementById("cartBtn");

const closeLogin = document.getElementById("closeLogin");
const closeCart = document.getElementById("closeCart");

const emailInput = document.getElementById("emailInput");
const otpInput = document.getElementById("otpInput");

const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

const loginMessage = document.getElementById("loginMessage");

const checkoutBtn = document.getElementById("checkoutBtn");


/* =========================================================
   4. LOAD PRODUCTS FROM SUPABASE
   ========================================================= */

async function loadProducts() {

    loading.style.display = "block";
    errorMessage.textContent = "";
    productsGrid.innerHTML = "";

    try {

        const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true });

        if (error) {
            throw error;
        }

        products = Array.isArray(data) ? data : [];

        loading.style.display = "none";

        if (products.length === 0) {

            productsGrid.innerHTML = `
                <div class="empty">
                    <h3>No products found</h3>
                    <p>Add products to your Supabase products table.</p>
                </div>
            `;

            return;
        }

        renderProducts();

    } catch (error) {

        loading.style.display = "none";

        console.error("Supabase product error:", error);

        errorMessage.textContent =
            "Unable to load products. Check your Supabase connection and RLS policies.";

    }
}


/* =========================================================
   5. PRODUCT VALUE HELPERS
   ========================================================= */

function getProductName(product) {

    return (
        product.name ||
        product.product_name ||
        product.title ||
        "Product"
    );
}


function getProductPrice(product) {

    const price =
        product.price ??
        product.selling_price ??
        product.sale_price ??
        0;

    const number = Number(price);

    return Number.isFinite(number) ? number : 0;
}


function getOldPrice(product) {

    const price =
        product.old_price ??
        product.original_price ??
        product.mrp ??
        null;

    if (price === null) {
        return null;
    }

    const number = Number(price);

    return Number.isFinite(number) ? number : null;
}


function getProductImage(product) {

    return (
        product.image_url ||
        product.image ||
        product.thumbnail ||
        "https://placehold.co/600x400?text=Blurancy+Cartify"
    );
}


function getProductDescription(product) {

    return (
        product.description ||
        "Quality product from Blurancy Cartify."
    );
}


/* =========================================================
   6. DISPLAY PRODUCTS
   ========================================================= */

function renderProducts() {

    productsGrid.innerHTML = "";

    const filteredProducts = products.filter(product => {

        const name = getProductName(product).toLowerCase();

        const description =
            getProductDescription(product).toLowerCase();

        return (
            name.includes(currentSearch) ||
            description.includes(currentSearch)
        );

    });


    if (filteredProducts.length === 0) {

        productsGrid.innerHTML = `
            <div class="empty">
                <h3>No matching products</h3>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }


    filteredProducts.forEach(product => {

        const price = getProductPrice(product);
        const oldPrice = getOldPrice(product);

        const card = document.createElement("div");

        card.className = "product-card";


        card.innerHTML = `
            <img
                src="${escapeHtml(getProductImage(product))}"
                alt="${escapeHtml(getProductName(product))}"
                onerror="this.src='https://placehold.co/600x400?text=Product'"
            >

            <div class="product-info">

                <h3>
                    ${escapeHtml(getProductName(product))}
                </h3>

                <p>
                    ${escapeHtml(getProductDescription(product))}
                </p>

                <div class="price">

                    <strong>
                        ₹${price.toFixed(2)}
                    </strong>

                    ${
                        oldPrice !== null && oldPrice > price
                        ?
                        `<span class="old-price">
                            ₹${oldPrice.toFixed(2)}
                        </span>`
                        :
                        ""
                    }

                </div>

                <button
                    class="add-cart"
                    data-product-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;


        productsGrid.appendChild(card);

    });


    document.querySelectorAll(".add-cart").forEach(button => {

        button.addEventListener("click", () => {

            const productId = button.dataset.productId;

            addToCart(productId);

        });

    });

}


/* =========================================================
   7. SEARCH
   ========================================================= */

searchInput.addEventListener("input", event => {

    currentSearch =
        event.target.value.trim().toLowerCase();

    renderProducts();

});


/* =========================================================
   8. CART
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "blurancy_cart",
        JSON.stringify(cart)
    );

}


function addToCart(productId) {

    const product = products.find(
        item => String(item.id) === String(productId)
    );

    if (!product) {

        alert("Product not found.");

        return;
    }


    const existingItem = cart.find(
        item => String(item.productId) === String(productId)
    );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            productId: product.id,
            quantity: 1
        });

    }


    saveCart();

    updateCartCount();

    alert("Product added to cart.");

}


function updateCartCount() {

    const count = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    cartCount.textContent = count;

}


/* =========================================================
   9. DISPLAY CART
   ========================================================= */

function renderCart() {

    cartItems.innerHTML = "";

    let total = 0;


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty">
                <p>Your cart is empty.</p>
            </div>
        `;

        cartTotal.textContent = "0.00";

        return;
    }


    cart.forEach(item => {

        const product = products.find(
            product =>
                String(product.id) === String(item.productId)
        );


        if (!product) {
            return;
        }


        const price = getProductPrice(product);

        const quantity = Math.max(
            1,
            Number(item.quantity || 1)
        );

        const subtotal = price * quantity;

        total += subtotal;


        const row = document.createElement("div");

        row.className = "cart-item";


        row.innerHTML = `
            <div>
                <strong>
                    ${escapeHtml(getProductName(product))}
                </strong>

                <p>
                    ₹${price.toFixed(2)}
                    ×
                    ${quantity}
                </p>
            </div>

            <div>

                <strong>
                    ₹${subtotal.toFixed(2)}
                </strong>

                <button
                    class="remove-cart"
                    data-product-id="${product.id}"
                >
                    Remove
                </button>

            </div>
        `;


        cartItems.appendChild(row);

    });


    cartTotal.textContent = total.toFixed(2);


    document.querySelectorAll(".remove-cart").forEach(button => {

        button.addEventListener("click", () => {

            removeFromCart(button.dataset.productId);

        });

    });

}


function removeFromCart(productId) {

    cart = cart.filter(
        item =>
            String(item.productId) !== String(productId)
    );

    saveCart();

    updateCartCount();

    renderCart();

}


/* =========================================================
   10. LOGIN MODAL
   ========================================================= */

loginBtn.addEventListener("click", () => {

    loginModal.classList.remove("hidden");

});


closeLogin.addEventListener("click", () => {

    loginModal.classList.add("hidden");

});


/* =========================================================
   11. EMAIL OTP LOGIN
   ========================================================= */

sendOtpBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();

    if (!email) {

        loginMessage.textContent =
            "Enter your email address.";

        return;
    }


    loginMessage.textContent =
        "Sending OTP...";


    try {

        const { error } =
            await supabaseClient.auth.signInWithOtp({

                email: email,

                options: {
                    shouldCreateUser: true
                }

            });


        if (error) {
            throw error;
        }


        loginMessage.textContent =
            "OTP sent. Check your email.";

    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            error.message || "Unable to send OTP.";

    }

});


/* =========================================================
   12. VERIFY OTP
   ========================================================= */

verifyOtpBtn.addEventListener("click", async () => {

    const email = emailInput.value.trim();
    const token = otpInput.value.trim();


    if (!email || !token) {

        loginMessage.textContent =
            "Enter your email and OTP.";

        return;
    }


    loginMessage.textContent =
        "Verifying OTP...";


    try {

        const { data, error } =
            await supabaseClient.auth.verifyOtp({

                email: email,
                token: token,
                type: "email"

            });


        if (error) {
            throw error;
        }


        loginMessage.textContent =
            "Login successful.";

        console.log("Logged in user:", data.user);

        setTimeout(() => {

            loginModal.classList.add("hidden");

        }, 1000);


    } catch (error) {

        console.error(error);

        loginMessage.textContent =
            error.message || "Invalid OTP.";

    }

});


/* =========================================================
   13. CART BUTTON
   ========================================================= */

cartBtn.addEventListener("click", () => {

    renderCart();

    cartModal.classList.remove("hidden");

});


closeCart.addEventListener("click", () => {

    cartModal.classList.add("hidden");

});


/* =========================================================
   14. CHECKOUT
   ========================================================= */

checkoutBtn.addEventListener("click", async () => {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }


    const {
        data: {
            user
        }
    } = await supabaseClient.auth.getUser();


    if (!user) {

        alert("Please login before checkout.");

        loginModal.classList.remove("hidden");

        return;
    }


    /*
       IMPORTANT:

       Do not put PayU secret credentials in this file.

       Payment should be handled by a secure backend /
       Supabase Edge Function.
    */


    alert(
        "Checkout is ready for backend payment integration."
    );

});


/* =========================================================
   15. SECURITY HELPER
   ========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   16. CHECK LOGIN SESSION
   ========================================================= */

async function checkLogin() {

    const {
        data: {
            session
        }
    } = await supabaseClient.auth.getSession();


    if (session && session.user) {

        loginBtn.textContent = "Account";

    } else {

        loginBtn.textContent = "Login";

    }

}


/* =========================================================
   17. AUTH STATE LISTENER
   ========================================================= */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        if (session) {

            loginBtn.textContent = "Account";

        } else {

            loginBtn.textContent = "Login";

        }

    }
);


/* =========================================================
   18. START APPLICATION
   ========================================================= */

async function startApp() {

    updateCartCount();

    await checkLogin();

    await loadProducts();

}


startApp();
```
