/* =========================================================
   BLURANCY CARTIFY
   FRONTEND APPLICATION
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const SUPABASE_URL =
  "YOUR_SUPABASE_PROJECT_URL";

const SUPABASE_PUBLISHABLE_KEY =
  "YOUR_SUPABASE_PUBLISHABLE_OR_PUBLISHABLE_KEY";

const API_BASE_URL =
  "YOUR_DEPLOYED_HTTPS_BACKEND_URL";


/* =========================================================
   SUPABASE
   ========================================================= */

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


/* =========================================================
   PRODUCT CATALOG
   ========================================================= */

const products = [

  {
    id: 1,
    name: "Wireless Bluetooth Earbuds",
    category: "Electronics",
    price: 999,
    oldPrice: 1999,
    stock: 100,
    image: "https://placehold.co/600x600?text=1"
  },

  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 1499,
    oldPrice: 2999,
    stock: 100,
    image: "https://placehold.co/600x600?text=2"
  },

  {
    id: 3,
    name: "Cotton T-Shirt",
    category: "Fashion",
    price: 499,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=3"
  },

  {
    id: 4,
    name: "Running Shoes",
    category: "Fashion",
    price: 1299,
    oldPrice: 2499,
    stock: 100,
    image: "https://placehold.co/600x600?text=4"
  },

  {
    id: 5,
    name: "LED Desk Lamp",
    category: "Home",
    price: 699,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=5"
  },

  {
    id: 6,
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 1199,
    oldPrice: 2199,
    stock: 100,
    image: "https://placehold.co/600x600?text=6"
  },

  {
    id: 7,
    name: "USB-C Fast Charger",
    category: "Electronics",
    price: 799,
    oldPrice: 1499,
    stock: 100,
    image: "https://placehold.co/600x600?text=7"
  },

  {
    id: 8,
    name: "Braided USB-C Cable",
    category: "Electronics",
    price: 299,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=8"
  },

  {
    id: 9,
    name: "Universal Phone Stand",
    category: "Electronics",
    price: 249,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=9"
  },

  {
    id: 10,
    name: "Premium Phone Case",
    category: "Electronics",
    price: 399,
    oldPrice: 799,
    stock: 100,
    image: "https://placehold.co/600x600?text=10"
  },

  {
    id: 11,
    name: "Wireless Keyboard",
    category: "Computers",
    price: 899,
    oldPrice: 1599,
    stock: 100,
    image: "https://placehold.co/600x600?text=11"
  },

  {
    id: 12,
    name: "Wireless Mouse",
    category: "Computers",
    price: 499,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=12"
  },

  {
    id: 13,
    name: "Laptop Backpack",
    category: "Computers",
    price: 999,
    oldPrice: 1999,
    stock: 100,
    image: "https://placehold.co/600x600?text=13"
  },

  {
    id: 14,
    name: "USB Hub 4-Port",
    category: "Computers",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=14"
  },

  {
    id: 15,
    name: "Laptop Cooling Pad",
    category: "Computers",
    price: 799,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=15"
  },

  {
    id: 16,
    name: "Men's Casual Shirt",
    category: "Fashion",
    price: 699,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=16"
  },

  {
    id: 17,
    name: "Men's Regular Fit Jeans",
    category: "Fashion",
    price: 1199,
    oldPrice: 2199,
    stock: 100,
    image: "https://placehold.co/600x600?text=17"
  },

  {
    id: 18,
    name: "Women's Casual Top",
    category: "Fashion",
    price: 599,
    oldPrice: 1199,
    stock: 100,
    image: "https://placehold.co/600x600?text=18"
  },

  {
    id: 19,
    name: "Women's Denim Jeans",
    category: "Fashion",
    price: 1299,
    oldPrice: 2399,
    stock: 100,
    image: "https://placehold.co/600x600?text=19"
  },

  {
    id: 20,
    name: "Hooded Sweatshirt",
    category: "Fashion",
    price: 899,
    oldPrice: 1699,
    stock: 100,
    image: "https://placehold.co/600x600?text=20"
  },

  {
    id: 21,
    name: "Men's Running Shoes",
    category: "Footwear",
    price: 1399,
    oldPrice: 2799,
    stock: 100,
    image: "https://placehold.co/600x600?text=21"
  },

  {
    id: 22,
    name: "Women's Walking Shoes",
    category: "Footwear",
    price: 1299,
    oldPrice: 2499,
    stock: 100,
    image: "https://placehold.co/600x600?text=22"
  },

  {
    id: 23,
    name: "Casual Sneakers",
    category: "Footwear",
    price: 1099,
    oldPrice: 2199,
    stock: 100,
    image: "https://placehold.co/600x600?text=23"
  },

  {
    id: 24,
    name: "Comfort Slippers",
    category: "Footwear",
    price: 399,
    oldPrice: 799,
    stock: 100,
    image: "https://placehold.co/600x600?text=24"
  },

  {
    id: 25,
    name: "Sports Sandals",
    category: "Footwear",
    price: 699,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=25"
  },

  {
    id: 26,
    name: "Travel Backpack",
    category: "Bags",
    price: 1199,
    oldPrice: 2299,
    stock: 100,
    image: "https://placehold.co/600x600?text=26"
  },

  {
    id: 27,
    name: "Laptop Bag",
    category: "Bags",
    price: 899,
    oldPrice: 1799,
    stock: 100,
    image: "https://placehold.co/600x600?text=27"
  },

  {
    id: 28,
    name: "Women's Handbag",
    category: "Bags",
    price: 999,
    oldPrice: 1999,
    stock: 100,
    image: "https://placehold.co/600x600?text=28"
  },

  {
    id: 29,
    name: "Travel Duffle Bag",
    category: "Bags",
    price: 1099,
    oldPrice: 2199,
    stock: 100,
    image: "https://placehold.co/600x600?text=29"
  },

  {
    id: 30,
    name: "School Backpack",
    category: "Bags",
    price: 799,
    oldPrice: 1499,
    stock: 100,
    image: "https://placehold.co/600x600?text=30"
  },

  {
    id: 31,
    name: "Face Wash",
    category: "Beauty",
    price: 249,
    oldPrice: 399,
    stock: 100,
    image: "https://placehold.co/600x600?text=31"
  },

  {
    id: 32,
    name: "Moisturizing Face Cream",
    category: "Beauty",
    price: 349,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=32"
  },

  {
    id: 33,
    name: "Shampoo",
    category: "Beauty",
    price: 299,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=33"
  },

  {
    id: 34,
    name: "Hair Conditioner",
    category: "Beauty",
    price: 329,
    oldPrice: 549,
    stock: 100,
    image: "https://placehold.co/600x600?text=34"
  },

  {
    id: 35,
    name: "Body Lotion",
    category: "Beauty",
    price: 279,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=35"
  },

  {
    id: 36,
    name: "Stainless Steel Water Bottle",
    category: "Home",
    price: 499,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=36"
  },

  {
    id: 37,
    name: "Non-Stick Frying Pan",
    category: "Home",
    price: 899,
    oldPrice: 1599,
    stock: 100,
    image: "https://placehold.co/600x600?text=37"
  },

  {
    id: 38,
    name: "Kitchen Storage Container Set",
    category: "Home",
    price: 699,
    oldPrice: 1199,
    stock: 100,
    image: "https://placehold.co/600x600?text=38"
  },

  {
    id: 39,
    name: "Electric Kettle",
    category: "Home",
    price: 999,
    oldPrice: 1699,
    stock: 100,
    image: "https://placehold.co/600x600?text=39"
  },

  {
    id: 40,
    name: "Stainless Steel Lunch Box",
    category: "Home",
    price: 449,
    oldPrice: 799,
    stock: 100,
    image: "https://placehold.co/600x600?text=40"
  },

  {
    id: 41,
    name: "Decorative Wall Clock",
    category: "Home",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=41"
  },

  {
    id: 42,
    name: "Artificial Indoor Plant",
    category: "Home",
    price: 399,
    oldPrice: 699,
    stock: 100,
    image: "https://placehold.co/600x600?text=42"
  },

  {
    id: 43,
    name: "Decorative Cushion Set",
    category: "Home",
    price: 699,
    oldPrice: 1199,
    stock: 100,
    image: "https://placehold.co/600x600?text=43"
  },

  {
    id: 44,
    name: "LED String Lights",
    category: "Home",
    price: 299,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=44"
  },

  {
    id: 45,
    name: "LED Table Lamp",
    category: "Home",
    price: 699,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=45"
  },

  {
    id: 46,
    name: "Premium Basmati Rice 5kg",
    category: "Grocery",
    price: 699,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=46"
  },

  {
    id: 47,
    name: "Wheat Flour 5kg",
    category: "Grocery",
    price: 299,
    oldPrice: 399,
    stock: 100,
    image: "https://placehold.co/600x600?text=47"
  },

  {
    id: 48,
    name: "Toor Dal 1kg",
    category: "Grocery",
    price: 159,
    oldPrice: 199,
    stock: 100,
    image: "https://placehold.co/600x600?text=48"
  },

  {
    id: 49,
    name: "Organic Green Tea",
    category: "Grocery",
    price: 249,
    oldPrice: 399,
    stock: 100,
    image: "https://placehold.co/600x600?text=49"
  },

  {
    id: 50,
    name: "Mixed Dry Fruits 500g",
    category: "Grocery",
    price: 599,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=50"
  },

  {
    id: 51,
    name: "Yoga Mat",
    category: "Fitness",
    price: 499,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=51"
  },

  {
    id: 52,
    name: "Adjustable Dumbbell",
    category: "Fitness",
    price: 1499,
    oldPrice: 2499,
    stock: 100,
    image: "https://placehold.co/600x600?text=52"
  },

  {
    id: 53,
    name: "Resistance Band Set",
    category: "Fitness",
    price: 399,
    oldPrice: 699,
    stock: 100,
    image: "https://placehold.co/600x600?text=53"
  },

  {
    id: 54,
    name: "Sports Water Bottle",
    category: "Fitness",
    price: 349,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=54"
  },

  {
    id: 55,
    name: "Fitness Skipping Rope",
    category: "Fitness",
    price: 249,
    oldPrice: 449,
    stock: 100,
    image: "https://placehold.co/600x600?text=55"
  },

  {
    id: 56,
    name: "Hardcover Notebook",
    category: "Books",
    price: 199,
    oldPrice: 299,
    stock: 100,
    image: "https://placehold.co/600x600?text=56"
  },

  {
    id: 57,
    name: "Ball Pen Pack",
    category: "Books",
    price: 99,
    oldPrice: 149,
    stock: 100,
    image: "https://placehold.co/600x600?text=57"
  },

  {
    id: 58,
    name: "Geometry Box",
    category: "Books",
    price: 149,
    oldPrice: 249,
    stock: 100,
    image: "https://placehold.co/600x600?text=58"
  },

  {
    id: 59,
    name: "Study Planner",
    category: "Books",
    price: 179,
    oldPrice: 299,
    stock: 100,
    image: "https://placehold.co/600x600?text=59"
  },

  {
    id: 60,
    name: "Sticky Notes Set",
    category: "Books",
    price: 129,
    oldPrice: 199,
    stock: 100,
    image: "https://placehold.co/600x600?text=60"
  },

  {
    id: 61,
    name: "Gaming Mouse",
    category: "Gaming",
    price: 699,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=61"
  },

  {
    id: 62,
    name: "Gaming Keyboard",
    category: "Gaming",
    price: 1299,
    oldPrice: 2299,
    stock: 100,
    image: "https://placehold.co/600x600?text=62"
  },

  {
    id: 63,
    name: "Gaming Headset",
    category: "Gaming",
    price: 999,
    oldPrice: 1799,
    stock: 100,
    image: "https://placehold.co/600x600?text=63"
  },

  {
    id: 64,
    name: "RGB Gaming Mouse Pad",
    category: "Gaming",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=64"
  },

  {
    id: 65,
    name: "Mobile Gaming Controller",
    category: "Gaming",
    price: 899,
    oldPrice: 1599,
    stock: 100,
    image: "https://placehold.co/600x600?text=65"
  },

  {
    id: 66,
    name: "Building Blocks Set",
    category: "Toys",
    price: 499,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=66"
  },

  {
    id: 67,
    name: "Remote Control Car",
    category: "Toys",
    price: 799,
    oldPrice: 1499,
    stock: 100,
    image: "https://placehold.co/600x600?text=67"
  },

  {
    id: 68,
    name: "Educational Puzzle Set",
    category: "Toys",
    price: 299,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=68"
  },

  {
    id: 69,
    name: "Kids Drawing Kit",
    category: "Toys",
    price: 349,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=69"
  },

  {
    id: 70,
    name: "Soft Teddy Bear",
    category: "Toys",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=70"
  },

  {
    id: 71,
    name: "Car Phone Holder",
    category: "Automotive",
    price: 349,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=71"
  },

  {
    id: 72,
    name: "Car Cleaning Kit",
    category: "Automotive",
    price: 499,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=72"
  },

  {
    id: 73,
    name: "Car Seat Cushion",
    category: "Automotive",
    price: 699,
    oldPrice: 1199,
    stock: 100,
    image: "https://placehold.co/600x600?text=73"
  },

  {
    id: 74,
    name: "Bike Phone Holder",
    category: "Automotive",
    price: 299,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=74"
  },

  {
    id: 75,
    name: "Car Emergency Tool Kit",
    category: "Automotive",
    price: 999,
    oldPrice: 1599,
    stock: 100,
    image: "https://placehold.co/600x600?text=75"
  },

  {
    id: 76,
    name: "Hard Shell Cabin Luggage",
    category: "Travel",
    price: 1799,
    oldPrice: 2999,
    stock: 100,
    image: "https://placehold.co/600x600?text=76"
  },

  {
    id: 77,
    name: "Travel Neck Pillow",
    category: "Travel",
    price: 399,
    oldPrice: 699,
    stock: 100,
    image: "https://placehold.co/600x600?text=77"
  },

  {
    id: 78,
    name: "Passport Holder",
    category: "Travel",
    price: 249,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=78"
  },

  {
    id: 79,
    name: "Travel Organizer Pouch",
    category: "Travel",
    price: 299,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=79"
  },

  {
    id: 80,
    name: "Foldable Travel Bag",
    category: "Travel",
    price: 499,
    oldPrice: 899,
    stock: 100,
    image: "https://placehold.co/600x600?text=80"
  },

  {
    id: 81,
    name: "Gardening Tool Set",
    category: "Garden",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=81"
  },

  {
    id: 82,
    name: "Plant Watering Can",
    category: "Garden",
    price: 299,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=82"
  },

  {
    id: 83,
    name: "Outdoor Camping Tent",
    category: "Garden",
    price: 1999,
    oldPrice: 3499,
    stock: 100,
    image: "https://placehold.co/600x600?text=83"
  },

  {
    id: 84,
    name: "LED Solar Garden Light",
    category: "Garden",
    price: 399,
    oldPrice: 699,
    stock: 100,
    image: "https://placehold.co/600x600?text=84"
  },

  {
    id: 85,
    name: "Outdoor Folding Chair",
    category: "Garden",
    price: 899,
    oldPrice: 1499,
    stock: 100,
    image: "https://placehold.co/600x600?text=85"
  },

  {
    id: 86,
    name: "Pet Feeding Bowl",
    category: "Pet",
    price: 249,
    oldPrice: 399,
    stock: 100,
    image: "https://placehold.co/600x600?text=86"
  },

  {
    id: 87,
    name: "Pet Grooming Brush",
    category: "Pet",
    price: 199,
    oldPrice: 349,
    stock: 100,
    image: "https://placehold.co/600x600?text=87"
  },

  {
    id: 88,
    name: "Pet Collar",
    category: "Pet",
    price: 149,
    oldPrice: 299,
    stock: 100,
    image: "https://placehold.co/600x600?text=88"
  },

  {
    id: 89,
    name: "Pet Toy Ball",
    category: "Pet",
    price: 129,
    oldPrice: 249,
    stock: 100,
    image: "https://placehold.co/600x600?text=89"
  },

  {
    id: 90,
    name: "Pet Travel Bag",
    category: "Pet",
    price: 899,
    oldPrice: 1499,
    stock: 100,
    image: "https://placehold.co/600x600?text=90"
  },

  {
    id: 91,
    name: "Office Desk Organizer",
    category: "Office",
    price: 349,
    oldPrice: 599,
    stock: 100,
    image: "https://placehold.co/600x600?text=91"
  },

  {
    id: 92,
    name: "Ergonomic Office Chair",
    category: "Office",
    price: 4999,
    oldPrice: 7999,
    stock: 100,
    image: "https://placehold.co/600x600?text=92"
  },

  {
    id: 93,
    name: "LED Desk Light",
    category: "Office",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=93"
  },

  {
    id: 94,
    name: "Document File Organizer",
    category: "Office",
    price: 249,
    oldPrice: 399,
    stock: 100,
    image: "https://placehold.co/600x600?text=94"
  },

  {
    id: 95,
    name: "A4 Printer Paper Pack",
    category: "Office",
    price: 399,
    oldPrice: 499,
    stock: 100,
    image: "https://placehold.co/600x600?text=95"
  },

  {
    id: 96,
    name: "Classic Analog Watch",
    category: "Accessories",
    price: 999,
    oldPrice: 1999,
    stock: 100,
    image: "https://placehold.co/600x600?text=96"
  },

  {
    id: 97,
    name: "Sunglasses",
    category: "Accessories",
    price: 499,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=97"
  },

  {
    id: 98,
    name: "Leather Wallet",
    category: "Accessories",
    price: 399,
    oldPrice: 799,
    stock: 100,
    image: "https://placehold.co/600x600?text=98"
  },

  {
    id: 99,
    name: "Gift Hamper",
    category: "Gifts",
    price: 799,
    oldPrice: 1299,
    stock: 100,
    image: "https://placehold.co/600x600?text=99"
  },

  {
    id: 100,
    name: "Premium Gift Box",
    category: "Gifts",
    price: 599,
    oldPrice: 999,
    stock: 100,
    image: "https://placehold.co/600x600?text=100"
  }

];


/* =========================================================
   CART
   ========================================================= */

let cart =
  JSON.parse(
    localStorage.getItem("blurancy_cart") || "[]"
  );


function saveCart() {

  localStorage.setItem(
    "blurancy_cart",
    JSON.stringify(cart)
  );

  renderCartCount();
  renderCart();
}


function renderCartCount() {

  const count =
    cart.reduce(
      (total, item) => total + item.qty,
      0
    );

  document.getElementById(
    "cartCount"
  ).textContent = count;
}


function safeProduct(id) {

  return products.find(
    product => product.id === Number(id)
  );

}


function addToCart(id) {

  const product = safeProduct(id);

  if (!product) {
    return;
  }

  const existing =
    cart.find(item => item.id === product.id);

  if (existing) {

    existing.qty =
      Math.min(
        existing.qty + 1,
        product.stock
      );

  } else {

    cart.push({
      id: product.id,
      qty: 1
    });

  }

  saveCart();

}


function changeQty(id, delta) {

  const item =
    cart.find(
      item => item.id === Number(id)
    );

  const product =
    safeProduct(id);

  if (!item || !product) {
    return;
  }

  item.qty =
    Math.max(
      0,
      Math.min(
        product.stock,
        item.qty + delta
      )
    );

  cart =
    cart.filter(
      item => item.qty > 0
    );

  saveCart();

}


/* =========================================================
   PRODUCTS
   ========================================================= */

function renderProducts() {

  const query =
    document
      .getElementById("searchInput")
      .value
      .trim()
      .toLowerCase();

  const category =
    document.getElementById(
      "categoryFilter"
    ).value;

  const min =
    Number(
      document.getElementById(
        "minPrice"
      ).value
    ) || 0;

  const max =
    Number(
      document.getElementById(
        "maxPrice"
      ).value
    ) || Infinity;


  const list =
    products.filter(product => {

      const matchesSearch =
        !query ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        !category ||
        product.category === category;

      const matchesPrice =
        product.price >= min &&
        product.price <= max;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );

    });


  document.getElementById(
    "productGrid"
  ).innerHTML =

    list.map(product => `

      <article class="card">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        <h3>
          ${product.name}
        </h3>

        <small>
          ${product.category}
        </small>

        <div class="price">

          ₹${product.price.toLocaleString("en-IN")}

          <span class="old">
            ₹${product.oldPrice.toLocaleString("en-IN")}
          </span>

        </div>

        <button
          type="button"
          onclick="addToCart(${product.id})"
        >
          Add to Cart
        </button>

      </article>

    `).join("")

    || "<p>No products found.</p>";

}


/* =========================================================
   CART DISPLAY
   ========================================================= */

function renderCart() {

  const cartItems =
    document.getElementById(
      "cartItems"
    );


  const rows =
    cart.map(item => {

      const product =
        safeProduct(item.id);

      if (!product) {
        return "";
      }

      return `

        <div class="cartrow">

          <div>

            <b>
              ${product.name}
            </b>

            <br>

            ₹${product.price.toLocaleString("en-IN")}

            × ${item.qty}

          </div>

          <div class="qty">

            <button
              type="button"
              onclick="changeQty(${product.id}, -1)"
            >
              −
            </button>

            <button
              type="button"
              onclick="changeQty(${product.id}, 1)"
            >
              +
            </button>

          </div>

        </div>

      `;

    }).join("");


  const total =
    cart.reduce(
      (sum, item) => {

        const product =
          safeProduct(item.id);

        return sum +
          (
            product
              ? product.price * item.qty
              : 0
          );

      },
      0
    );


  cartItems.innerHTML =
    rows ||
    "<p>Your cart is empty.</p>";


  if (rows) {

    cartItems.insertAdjacentHTML(
      "beforeend",
      `
        <h3>
          Total:
          ₹${total.toLocaleString("en-IN")}
        </h3>
      `
    );

  }

}


/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {

  document
    .getElementById(id)
    .classList.remove("hidden");

}


function closeModal(id) {

  document
    .getElementById(id)
    .classList.add("hidden");

}


/* =========================================================
   SUPABASE REAL OTP
   ========================================================= */

async function sendRealOTP() {

  const phone =
    document
      .getElementById("phoneNumber")
      .value
      .trim();


  if (!/^\+91\d{10}$/.test(phone)) {

    document.getElementById(
      "authMessage"
    ).textContent =
      "Enter a valid +91 phone number.";

    return;
  }


  const {
    error
  } =
    await supabaseClient.auth.signInWithOtp({
      phone: phone
    });


  document.getElementById(
    "authMessage"
  ).textContent =
    error
      ? error.message
      : "OTP sent. Check your SMS.";

}


async function verifyRealOTP() {

  const phone =
    document
      .getElementById("phoneNumber")
      .value
      .trim();

  const token =
    document
      .getElementById("otpCode")
      .value
      .trim();


  const {
    data,
    error
  } =
    await supabaseClient.auth.verifyOtp({

      phone: phone,

      token: token,

      type: "sms"

    });


  document.getElementById(
    "authMessage"
  ).textContent =
    error
      ? error.message
      : "Login successful.";


  if (!error) {

    setTimeout(
      () => closeModal("loginModal"),
      700
    );

  }

}


/* =========================================================
   PAYU CHECKOUT
   ========================================================= */

async function startPayU() {

  if (!cart.length) {

    document.getElementById(
      "checkoutMessage"
    ).textContent =
      "Your cart is empty.";

    return;
  }


  const name =
    document
      .getElementById("customerName")
      .value
      .trim();

  const email =
    document
      .getElementById("customerEmail")
      .value
      .trim();

  const phone =
    document
      .getElementById("customerPhone")
      .value
      .trim();

  const address =
    document
      .getElementById("shippingAddress")
      .value
      .trim();

  const pin =
    document
      .getElementById("shippingPin")
      .value
      .trim();


  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    !/^[0-9]{6}$/.test(pin)
  ) {

    document.getElementById(
      "checkoutMessage"
    ).textContent =
      "Complete all checkout fields.";

    return;
  }


  if (
    API_BASE_URL.startsWith("YOUR_")
  ) {

    document.getElementById(
      "checkoutMessage"
    ).textContent =
      "Configure your deployed HTTPS backend URL first.";

    return;
  }


  document.getElementById(
    "checkoutMessage"
  ).textContent =
    "Creating secure PayU payment...";


  const payload = {

    customer: {

      name: name,

      email: email,

      phone: phone,

      address: address,

      pin: pin

    },

    items:

      cart.map(item => ({

        productId: item.id,

        quantity: item.qty

      }))

  };


  try {

    const response =
      await fetch(
        API_BASE_URL +
        "/api/payu/create-payment",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body:
            JSON.stringify(payload)

        }
      );


    const data =
      await response
        .json()
        .catch(() => ({}));


    if (!response.ok) {

      document.getElementById(
        "checkoutMessage"
      ).textContent =
        data.error ||
        "Unable to start payment.";

      return;
    }


    const form =
      document.createElement("form");


    form.method = "POST";

    form.action =
      data.formAction;


    Object.entries(
      data.fields
    ).forEach(
      ([key, value]) => {

        const input =
          document.createElement(
            "input"
          );

        input.type = "hidden";

        input.name = key;

        input.value = value;

        form.appendChild(input);

      }
    );


    document.body.appendChild(form);

    form.submit();


  } catch (error) {

    console.error(error);

    document.getElementById(
      "checkoutMessage"
    ).textContent =
      "Payment server unavailable.";

  }

}


/* =========================================================
   EVENTS
   ========================================================= */

document
  .getElementById("searchForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      renderProducts();

    }
  );


[
  "searchInput",
  "minPrice",
  "maxPrice"
].forEach(id => {

  document
    .getElementById(id)
    .addEventListener(
      "input",
      renderProducts
    );

});


document
  .getElementById(
    "categoryFilter"
  )
  .addEventListener(
    "change",
    renderProducts
  );


document
  .getElementById(
    "clearFilters"
  )
  .addEventListener(
    "click",
    () => {

      document.getElementById(
        "searchInput"
      ).value = "";

      document.getElementById(
        "minPrice"
      ).value = "";

      document.getElementById(
        "maxPrice"
      ).value = "";

      document.getElementById(
        "categoryFilter"
      ).value = "";

      renderProducts();

    }
  );


document
  .getElementById("loginBtn")
  .addEventListener(
    "click",
    () => openModal("loginModal")
  );


document
  .getElementById("cartBtn")
  .addEventListener(
    "click",
    () => {

      renderCart();

      openModal("cartModal");

    }
  );


document
  .getElementById("sendOtpBtn")
  .addEventListener(
    "click",
    sendRealOTP
  );


document
  .getElementById("verifyOtpBtn")
  .addEventListener(
    "click",
    verifyRealOTP
  );


document
  .getElementById("payuBtn")
  .addEventListener(
    "click",
    startPayU
  );


document
  .querySelectorAll(
    "[data-close]"
  )
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


/* =========================================================
   CATEGORY LIST
   ========================================================= */

[
  ...new Set(
    products.map(
      product => product.category
    )
  )
]
.sort()
.forEach(category => {

  document
    .getElementById(
      "categoryFilter"
    )
    .insertAdjacentHTML(
      "beforeend",
      `<option value="${category}">
        ${category}
      </option>`
    );

});


/* =========================================================
   START
   ========================================================= */

renderProducts();

renderCartCount();

renderCart();
