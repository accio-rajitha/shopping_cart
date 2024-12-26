
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");


const API_URL = "https://fakestoreapi.com/products";


let products = [];
let filteredProducts = [];


function checkUserLogin() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to log in to access this page.");
        window.location.href = "login.html"; 
    }
}


async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        products = await response.json();
        filteredProducts = products; 
        displayProductsByCategory();
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}


function displayProductsByCategory() {
    productGrid.innerHTML = ""; 

   
    const categories = [
        { name: "Men's Clothing", key: "men's clothing" },
        { name: "Women's Clothing", key: "women's clothing" },
        { name: "Electronics", key: "electronics" },
        { name: "Jewelry", key: "jewelery" },
    ];

    categories.forEach((category) => {
        const categoryProducts = filteredProducts.filter(
            (product) => product.category.toLowerCase() === category.key.toLowerCase()
        );

        if (categoryProducts.length > 0) {
            const categorySection = document.createElement("div");
            categorySection.classList.add("category-section");

            const categoryHeading = document.createElement("h2");
            categoryHeading.textContent = category.name;
            categoryHeading.className = "category-heading";
            categorySection.appendChild(categoryHeading);

            const categoryGrid = document.createElement("div");
            categoryGrid.className = "category-grid";

            categoryProducts.forEach((product) => {
                const productCard = createProductCard(product);
                categoryGrid.appendChild(productCard);
            });

            categorySection.appendChild(categoryGrid);
            productGrid.appendChild(categorySection);
        }
    });
}


function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <img class="product-image" src="${product.image}" alt="${product.title}">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>

        <div class="product-options">
            <div class="option">
                <label for="color-${product.id}">Color</label>
                <select class="product-select" id="color-${product.id}">
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                </select>
            </div>
            <div class="option">
                <label for="size-${product.id}">Size</label>
                <select class="product-select" id="size-${product.id}">
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                </select>
            </div>
            <div class="option">
                <label for="quantity-${product.id}">Quantity</label>
                <input type="number" class="quantity-input" id="quantity-${product.id}" value="1" min="1">
            </div>
        </div>

        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    return card;
}


function addToCart(productId) {
    if (!products || products.length === 0) {
        alert("Products are still loading. Please wait.");
        return;
    }

    const color = document.getElementById(`color-${productId}`).value;
    const size = document.getElementById(`size-${productId}`).value;
    const quantity = parseInt(document.getElementById(`quantity-${productId}`).value, 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
        (item) => item.id === productId && item.color === color && item.size === size
    );

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        const product = products.find((item) => item.id === productId);
        if (product) {
            cart.push({
                ...product,
                color,
                size,
                quantity,
            });
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${quantity} of ${products.find((item) => item.id === productId).title} to cart!`);
}


function searchProducts() {
    const query = searchInput.value.toLowerCase();
    filteredProducts = products.filter((product) =>
        product.title.toLowerCase().includes(query)
    );
    displayProductsByCategory();
}


function filterByCategory(categoryKey) {
    filteredProducts = categoryKey === "all" 
        ? products 
        : products.filter((product) => product.category.toLowerCase() === categoryKey.toLowerCase());
    displayProductsByCategory();
}


function applyFilters() {
    const maxPrice = document.getElementById("price-range").value;
    filteredProducts = products.filter((product) => product.price <= maxPrice);
    displayProductsByCategory();
}


document.getElementById("price-range").addEventListener("input", (event) => {
    document.getElementById("price-value").textContent = `$${event.target.value}`;
});


function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}


checkUserLogin();
fetchProducts();
searchInput.addEventListener("input", searchProducts);
