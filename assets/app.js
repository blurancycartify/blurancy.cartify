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

  function rupees(value) {
    return "₹" + value.toLocaleString("en-IN");
  }

  function renderProducts(list) {
    if (!productGrid) return;

    if (list.length === 0) {
      productGrid.innerHTML = "<p>No products found.</p>";
      return;
    }

    productGrid.innerHTML = list.map(function (product) {
      const discount = Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );

      return `
        <div class="product-card">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

          <div class="product-info">
            <h3>${product.name}</h3>

            <p>${product.category}</p>

            <strong>${rupees(product.price)}</strong>

            <del>${rupees(product.oldPrice)}</del>

            <span>${discount}% OFF</span>

            <button
              class="primary"
              onclick="addToCart(${product.id})"
            >
              Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

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

    localStorage.setItem("blurancyCart", JSON.stringify(cart));

    updateCartCount();

    alert(product.name + " added to cart!");
  };

  function updateCartCount() {
    const total = cart.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);

    const cartCount = document.getElementById("cartCount");

    if (cartCount) {
      cartCount.textContent = total;
    }
  }

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const search = searchInput.value.toLowerCase();

      const filtered = products.filter(function (product) {
        return (
          product.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
        );
      });

      renderProducts(filtered);
    });
  }

  const categoryFilter = document.getElementById("categoryFilter");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", function () {
      const category = categoryFilter.value;

      if (category === "all") {
        renderProducts(products);
        return;
      }

      const filtered = products.filter(function (product) {
        return product.category.toLowerCase() === category.toLowerCase();
      });

      renderProducts(filtered);
    });
  }

  renderProducts(products);
  updateCartCount();
});
