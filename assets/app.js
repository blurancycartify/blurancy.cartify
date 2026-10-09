```javascript
/* =====================================
   BLURANCY CARTIFY
   Real Supabase products only
   ===================================== */

// Keep your existing Supabase URL and public API key here.
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const PRODUCT_TABLE = "Product";

async function loadProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.replaceChildren();

  try {
    const response = await fetch(
      `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/${encodeURIComponent(PRODUCT_TABLE)}?select=product_id,product_name,product_description,product_price,product_image_url,stock`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const products = await response.json();

    if (products.length === 0) {
      grid.textContent = "No products available.";
      return;
    }

    products.forEach(product => {
      const card = document.createElement("article");
      const title = document.createElement("h3");
      const description = document.createElement("p");
      const price = document.createElement("p");
      const stock = document.createElement("p");

      title.textContent = product.product_name || "Product";
      description.textContent = product.product_description || "";
      price.textContent = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
      }).format(Number(product.product_price || 0));

      stock.textContent =
        Number(product.stock) > 0 ? "In stock" : "Out of stock";

      card.append(title, description, price, stock);

      if (product.product_image_url) {
        const image = document.createElement("img");
        image.src = product.product_image_url;
        image.alt = product.product_name || "Product";
        image.loading = "lazy";
        image.onerror = () => image.remove();
        image.style.maxWidth = "180px";
        card.prepend(image);
      }

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Blurancy Cartify:", error);
    grid.textContent =
      "Products could not be loaded. Please check the connection.";
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);
```
