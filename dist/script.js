"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e, _f, _g, _h;
let currentProductId = null;
let allProducts = [];
let cart = [];
function fetchProducts() {
    return __awaiter(this, arguments, void 0, function* (adminView = true) {
        const response = yield fetch('http://localhost:3000/products');
        const products = yield response.json();
        allProducts = products;
        displayProducts(products, adminView);
    });
}
(_a = document.getElementById('user-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    switchToUserView();
});
(_b = document.getElementById('admin-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    switchToAdminView();
});
function switchToUserView() {
    const welcomePage = document.querySelector('.welcome-page');
    const mainPage = document.querySelector('.main');
    welcomePage.style.display = 'none';
    mainPage.style.display = 'block';
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Fit Feet - User';
    fetchProducts(false);
    const itemsForm = document.getElementById('itemsform');
    if (itemsForm) {
        itemsForm.style.display = 'none';
    }
}
function switchToAdminView() {
    const welcomePage = document.querySelector('.welcome-page');
    const mainPage = document.querySelector('.main');
    welcomePage.style.display = 'none';
    mainPage.style.display = 'block';
    const titleElement = document.getElementById('title');
    titleElement.textContent = 'Fit Feet - Admin';
    fetchProducts(true);
    const itemsForm = document.getElementById('itemsform');
    if (itemsForm) {
        itemsForm.style.display = 'block';
    }
}
function displayProducts(products, adminView = true) {
    const itemsContainer = document.querySelector('.itemscontainer');
    itemsContainer.innerHTML = '';
    products.forEach((product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.item}" style="width: 100px; height: 100px;">
      <h3>${product.item}</h3>
      <p>Price: ${product.price}</p>
      <p>Description: ${product.description}</p>
      ${adminView ? `
      <button class="update-btn">Update</button>
      <button class="delete-btn">Delete</button>
      ` : `
      <button class="add-to-cart-btn">Add to Cart</button>
      `}
    `;
        itemsContainer.appendChild(productCard);
    });
    if (adminView) {
        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', handleUpdate);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }
    else {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });
    }
}
(_c = document.getElementById('itemsform')) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const itemInput = document.getElementById('item');
    const priceInput = document.getElementById('price');
    const descriptionInput = document.getElementById('description');
    const imageUrlInput = document.getElementById('imageUrl');
    const item = itemInput.value;
    const price = priceInput.value;
    const description = descriptionInput.value;
    const imageUrl = imageUrlInput.value;
    clearValidationMessages();
    let isValid = true;
    if (!item) {
        displayValidationMessage(itemInput, '! Enter your details!');
        isValid = false;
    }
    if (!price) {
        displayValidationMessage(priceInput, '! Enter your details!');
        isValid = false;
    }
    if (!description) {
        displayValidationMessage(descriptionInput, '! Enter your details!');
        isValid = false;
    }
    if (!imageUrl) {
        displayValidationMessage(imageUrlInput, '! Enter your details!');
        isValid = false;
    }
    if (!isValid) {
        return;
    }
    const newProduct = { item, price, description, imageUrl };
    const response = yield fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    });
    const createdProduct = yield response.json();
    fetchProducts();
    document.getElementById('itemsform').reset();
}));
function displayValidationMessage(inputElement, message) {
    let messageElement = inputElement.nextElementSibling;
    if (!messageElement || !messageElement.classList.contains('validation-message')) {
        messageElement = document.createElement('div');
        messageElement.className = 'validation-message';
        inputElement.insertAdjacentElement('afterend', messageElement);
    }
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}
function clearValidationMessages() {
    document.querySelectorAll('.validation-message').forEach(messageElement => {
        messageElement.remove();
    });
}
function handleDelete(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const productCard = event.target.closest('.product-card');
        const productId = productCard.dataset.id;
        if (productId) {
            yield fetch(`http://localhost:3000/products/${productId}`, {
                method: 'DELETE',
            });
            fetchProducts();
        }
    });
}
function handleUpdate(event) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const productCard = event.target.closest('.product-card');
        const productId = productCard.dataset.id;
        if (productId) {
            currentProductId = productId;
            const item = ((_a = productCard === null || productCard === void 0 ? void 0 : productCard.querySelector('h3')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
            const price = ((_c = (_b = productCard === null || productCard === void 0 ? void 0 : productCard.querySelector('p:nth-child(2)')) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.replace('Price: ', '')) || '';
            const description = ((_e = (_d = productCard === null || productCard === void 0 ? void 0 : productCard.querySelector('p:nth-child(3)')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.replace('Description: ', '')) || '';
            const imageUrl = ((_f = productCard === null || productCard === void 0 ? void 0 : productCard.querySelector('img')) === null || _f === void 0 ? void 0 : _f.src) || '';
            document.getElementById('item').value = item;
            document.getElementById('price').value = price;
            document.getElementById('description').value = description;
            document.getElementById('imageUrl').value = imageUrl;
        }
    });
}
(_d = document.getElementById('update-btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    if (currentProductId) {
        const itemInput = document.getElementById('item');
        const priceInput = document.getElementById('price');
        const descriptionInput = document.getElementById('description');
        const imageUrlInput = document.getElementById('imageUrl');
        const item = itemInput.value;
        const price = priceInput.value;
        const description = descriptionInput.value;
        const imageUrl = imageUrlInput.value;
        clearValidationMessages();
        let isValid = true;
        if (!item) {
            displayValidationMessage(itemInput, '! Enter your details!');
            isValid = false;
        }
        if (!price) {
            displayValidationMessage(priceInput, '! Enter your details!');
            isValid = false;
        }
        if (!description) {
            displayValidationMessage(descriptionInput, '! Enter your details!');
            isValid = false;
        }
        if (!imageUrl) {
            displayValidationMessage(imageUrlInput, '! Enter your details!');
            isValid = false;
        }
        if (!isValid) {
            return;
        }
        const updatedProduct = { item, price, description, imageUrl };
        yield fetch(`http://localhost:3000/products/${currentProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProduct),
        });
        fetchProducts();
        currentProductId = null;
        document.getElementById('itemsform').reset();
    }
}));
(_e = document.getElementById('user-btn')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
    switchToUserView();
});
(_f = document.querySelector('.name input')) === null || _f === void 0 ? void 0 : _f.addEventListener('input', (event) => {
    var _a, _b;
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = allProducts.filter(product => product.item.toLowerCase().includes(searchTerm));
    const isAdminView = (_b = (_a = document.getElementById('title')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.includes('Admin');
    displayProducts(filteredProducts, isAdminView);
});
function handleAddToCart(event) {
    const productCard = event.target.closest('.product-card');
    const productId = productCard.dataset.id;
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        alert(`${product.item} has been added to your cart.`);
    }
}
(_g = document.getElementById('cart-btn')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => {
    displayCart();
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'block';
});
(_h = document.getElementById('close-cart-btn')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', () => {
    const cartModal = document.getElementById('cart-modal');
    cartModal.style.display = 'none';
});
function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    }
    else {
        cart.forEach((product, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.item}" style="width: 50px; height: 50px;">
        <h4>${product.item}</h4>
        <p>Price: ${product.price}</p>
        <p>Description: ${product.description}</p>
        <button class="remove-from-cart-btn" data-index="${index}">Remove</button>
      `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', handleRemoveFromCart);
    });
}
function handleRemoveFromCart(event) {
    const button = event.target;
    const index = parseInt(button.dataset.index || '');
    if (!isNaN(index)) {
        cart.splice(index, 1);
        displayCart();
    }
}
