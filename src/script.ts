interface Product {
  id: string;
  item: string;
  price: string;
  description: string;
  imageUrl: string;
}

let currentProductId: string | null = null;
let allProducts: Product[] = [];
let cart: Product[] = [];

async function fetchProducts(adminView = true) {
  const response = await fetch('http://localhost:3000/products');
  const products: Product[] = await response.json();
  allProducts = products;
  displayProducts(products, adminView);
}


document.getElementById('user-btn')?.addEventListener('click', () => {
    switchToUserView();
});

document.getElementById('admin-btn')?.addEventListener('click', () => {
    switchToAdminView();
});


function switchToUserView() {
    const welcomePage = document.querySelector('.welcome-page') as HTMLElement;
    const mainPage = document.querySelector('.main') as HTMLElement;

    welcomePage.style.display = 'none';
    mainPage.style.display = 'block';

    const titleElement = document.getElementById('title') as HTMLElement;
    titleElement.textContent = 'Fit Feet - User';

    fetchProducts(false); 

  
    const itemsForm = document.getElementById('itemsform');
    if (itemsForm) {
        itemsForm.style.display = 'none';
    }
}


function switchToAdminView() {
    const welcomePage = document.querySelector('.welcome-page') as HTMLElement;
    const mainPage = document.querySelector('.main') as HTMLElement;

    welcomePage.style.display = 'none';
    mainPage.style.display = 'block';

    const titleElement = document.getElementById('title') as HTMLElement;
    titleElement.textContent = 'Fit Feet - Admin';

    fetchProducts(true);

    
    const itemsForm = document.getElementById('itemsform');
    if (itemsForm) {
        itemsForm.style.display = 'block';
    }
}

function displayProducts(products: Product[], adminView = true) {
  const itemsContainer = document.querySelector('.itemscontainer') as HTMLElement;
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
  } else {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', handleAddToCart);
    });
  }
}
document.getElementById('itemsform')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const itemInput = document.getElementById('item') as HTMLInputElement;
  const priceInput = document.getElementById('price') as HTMLInputElement;
  const descriptionInput = document.getElementById('description') as HTMLInputElement;
  const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement;

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

  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });

  const createdProduct: Product = await response.json();
  fetchProducts();
  (document.getElementById('itemsform') as HTMLFormElement).reset();
});

function displayValidationMessage(inputElement: HTMLInputElement, message: string) {
  let messageElement = inputElement.nextElementSibling as HTMLElement;
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

async function handleDelete(event: Event) {
  const productCard = (event.target as HTMLElement).closest('.product-card');
  const productId = (productCard as HTMLElement).dataset.id;

  if (productId) {
    await fetch(`http://localhost:3000/products/${productId}`, {
      method: 'DELETE',
    });

    fetchProducts();
  }
}

async function handleUpdate(event: Event) {
  const productCard = (event.target as HTMLElement).closest('.product-card');
  const productId = (productCard as HTMLElement).dataset.id;

  if (productId) {
    currentProductId = productId;

    const item = productCard?.querySelector('h3')?.textContent || '';
    const price = productCard?.querySelector('p:nth-child(2)')?.textContent?.replace('Price: ', '') || '';
    const description = productCard?.querySelector('p:nth-child(3)')?.textContent?.replace('Description: ', '') || '';
    const imageUrl = productCard?.querySelector('img')?.src || '';

    (document.getElementById('item') as HTMLInputElement).value = item;
    (document.getElementById('price') as HTMLInputElement).value = price;
    (document.getElementById('description') as HTMLInputElement).value = description;
    (document.getElementById('imageUrl') as HTMLInputElement).value = imageUrl;
  }
}

document.getElementById('update-btn')?.addEventListener('click', async (event) => {
  event.preventDefault();

  if (currentProductId) {
    const itemInput = document.getElementById('item') as HTMLInputElement;
    const priceInput = document.getElementById('price') as HTMLInputElement;
    const descriptionInput = document.getElementById('description') as HTMLInputElement;
    const imageUrlInput = document.getElementById('imageUrl') as HTMLInputElement;

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

    await fetch(`http://localhost:3000/products/${currentProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    fetchProducts();
    currentProductId = null;
    (document.getElementById('itemsform') as HTMLFormElement).reset();
  }
});

document.getElementById('user-btn')?.addEventListener('click', () => {
  switchToUserView();
});

document.querySelector('.name input')?.addEventListener('input', (event) => {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  const filteredProducts = allProducts.filter(product => product.item.toLowerCase().includes(searchTerm));
  const isAdminView = document.getElementById('title')?.textContent?.includes('Admin');
  displayProducts(filteredProducts, isAdminView);
});

function handleAddToCart(event: Event) {
  const productCard = (event.target as HTMLElement).closest('.product-card');
  const productId = (productCard as HTMLElement).dataset.id;
  const product = allProducts.find(p => p.id === productId);

  if (product) {
    cart.push(product);
    alert(`${product.item} has been added to your cart.`);
  }
}


document.getElementById('cart-btn')?.addEventListener('click', () => {
  displayCart();
  const cartModal = document.getElementById('cart-modal') as HTMLElement;
  cartModal.style.display = 'block';
});


document.getElementById('close-cart-btn')?.addEventListener('click', () => {
  const cartModal = document.getElementById('cart-modal') as HTMLElement;
  cartModal.style.display = 'none';
});


function displayCart() {
  const cartItemsContainer = document.getElementById('cart-items') as HTMLElement;
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
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

function handleRemoveFromCart(event: Event) {
  const button = event.target as HTMLButtonElement;
  const index = parseInt(button.dataset.index || '');

  if (!isNaN(index)) {
    cart.splice(index, 1);
    displayCart();
  }
}