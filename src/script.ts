interface Product {
  id: string;
  item: string;
  price: string;
  description: string;
  imageUrl: string;
}

let currentProductId: string | null = null;
let allProducts: Product[] = []; 

async function fetchProducts() {
  const response = await fetch('http://localhost:3000/products');
  const products: Product[] = await response.json();
  allProducts = products;
  displayProducts(products);
}

function displayProducts(products: Product[]) {
  const itemsContainer = document.querySelector('.itemscontainer') as HTMLElement;
  itemsContainer.innerHTML = ''; 

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;
    productCard.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.item}">
      <h3>${product.item}</h3>
      <p>Price: ${product.price}</p>
      <p>Description: ${product.description}</p>
      <button class="update-btn">Update</button>
      <button class="delete-btn">Delete</button>
    `;
    itemsContainer.appendChild(productCard);
  });

  document.querySelectorAll('.update-btn').forEach(button => {
    button.addEventListener('click', handleUpdate);
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', handleDelete);
  });
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

document.querySelector('.name input')?.addEventListener('input', (event) => {
  const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  const filteredProducts = allProducts.filter(product => product.item.toLowerCase().includes(searchTerm));
  displayProducts(filteredProducts);
});

fetchProducts();
