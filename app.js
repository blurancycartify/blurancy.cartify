document.addEventListener("DOMContentLoaded", function () {
    console.log("Blurancy Cartify loaded");

    const searchInput = document.getElementById("searchInput");
    const products = document.querySelectorAll(".product-card");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const searchText = searchInput.value.toLowerCase();

            products.forEach(function (product) {
                product.style.display =
                    product.textContent.toLowerCase().includes(searchText)
                    ? ""
                    : "none";
            });
        });
    }

    const cartButtons = document.querySelectorAll(".add-to-cart");

    cartButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const productName =
                button.getAttribute("data-product") || "Product";

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            cart.push({
                name: productName,
                quantity: 1
            });

            localStorage.setItem("cart", JSON.stringify(cart));

            alert(productName + " added to cart!");
        });
    });
});
