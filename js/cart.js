
if (!localStorage.getItem('token')) {
   
    window.location.href = 'login.html'; 
}



const cartContainer = document.getElementById("cart-container");
const totalPriceElement = document.getElementById("total-price");
const priceDetailsContainer = document.getElementById("price-details-container");
const checkoutButton = document.getElementById("rzp-button1");


function getCartData() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


function renderCart() {
    const cart = getCartData();
    cartContainer.innerHTML = ''; 
    priceDetailsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty</p>";
        return;
    }

    let total = 0;
    const priceList = document.createElement("ol"); 

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>Color: ${item.color}</p>
                <p>Size: ${item.size}</p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button onclick="changeQuantity(${index}, 'decrease')">-</button>
                    <input type="number" value="${item.quantity}" min="1" id="quantity-${index}" onchange="updateQuantity(${index})">
                    <button onclick="changeQuantity(${index}, 'increase')">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
        cartContainer.appendChild(cartItem);

        
        let itemTotal = item.price * item.quantity;
        let priceDetail = document.createElement("li");
        priceDetail.textContent = `${item.title} - $${itemTotal.toFixed(2)} (x${item.quantity})`;
        priceList.appendChild(priceDetail);

        total += itemTotal; 
    });

    priceDetailsContainer.appendChild(priceList); 
    totalPriceElement.textContent = total.toFixed(2);
}


function updateTotalPrice() {
    const cart = getCartData();
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    totalPriceElement.textContent = total.toFixed(2);
}


function changeQuantity(index, action) {
    const cart = getCartData();
    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease' && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


function updateQuantity(index) {
    const cart = getCartData();
    const newQuantity = parseInt(document.getElementById(`quantity-${index}`).value, 10);
    if (newQuantity > 0) {
        cart[index].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}


function removeFromCart(index) {
    const cart = getCartData();
    cart.splice(index, 1); 
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


document.getElementById("rzp-button1").onclick = function (e) {
    const cart = getCartData();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += item.price * item.quantity;
    });

    var options = {
        key: "rzp_test_PV1oQ0oMtgXOsq", 
        amount: totalAmount * 100, 
        currency: "INR",
        name: "MyShop Checkout",
        description: "This is your order",
        theme: {
            color: "#000",
        },
        image: "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg", // Logo Image
        handler: function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            localStorage.removeItem("cart"); 
            renderCart(); 
        },
    };

    var rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();
};


renderCart();
