document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartIconBadge = document.getElementById("cart-badge");
    const cartPanel = document.getElementById("cart-panel");
    const cartToggle = document.getElementById("cart-toggle");
    const clearCartButton = document.getElementById("clear-cart");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Fetch food data from API
    fetch("https://api.npoint.io/d48587410594df0f5932")
        .then(response => response.json())
        .then(products => {
            displayProducts(products);
        })
        .catch(error => console.error("Error fetching food items:", error));

    function displayProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.food_image}" alt="${product.food_name}" class="product-image">
                <h3>${product.food_name}</h3>
                <p>${product.food_description}</p>
                <p><strong>₹${product.food_price.toFixed(2)}</strong></p>
                <button class="add-to-cart" data-id="${product.food_id}" data-name="${product.food_name}" data-price="${product.food_price}">Add to Cart</button>
            `;
            productList.appendChild(productCard);
        });

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.dataset.id;
                const name = event.target.dataset.name;
                const price = parseFloat(event.target.dataset.price);
                addToCart(id, name, price);
            });
        });
    }

    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <span>${item.name} - ₹${item.price.toFixed(2)} x ${item.quantity}</span>
                <button class="decrease" data-id="${item.id}">-</button>
                <button class="increase" data-id="${item.id}">+</button>
                <button class="remove" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
        cartIconBadge.textContent = cart.length;
        localStorage.setItem("cart", JSON.stringify(cart));

        document.querySelectorAll(".increase").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.dataset.id;
                changeQuantity(id, 1);
            });
        });

        document.querySelectorAll(".decrease").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.dataset.id;
                changeQuantity(id, -1);
            });
        });

        document.querySelectorAll(".remove").forEach(button => {
            button.addEventListener("click", event => {
                const id = event.target.dataset.id;
                removeFromCart(id);
            });
        });
    }

    function changeQuantity(id, amount) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += amount;
            if (item.quantity <= 0) {
                removeFromCart(id);
            } else {
                updateCart();
            }
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    cartToggle.addEventListener("click", () => {
        if (cartPanel.style.right === "0px") {
            cartPanel.style.right = "-320px"; // Hide the cart
        } else {
            cartPanel.style.right = "0px"; // Show the cart
        }
    });
    

    clearCartButton.addEventListener("click", () => {
        cart = [];
        updateCart();
    });

    updateCart(); // Load cart from localStorage
});
