document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    const categoryMenu = document.getElementById('category-menu');
    const productList = document.getElementById('product-list');
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');
    const promoContainer = document.querySelector('.promo-container');

    // Fetch categories from the API
    fetch('https://dummyjson.com/products/category-list')
        .then(response => response.json())
        .then(categories => {
            categories.forEach(category => {
                const storedImageUrl = localStorage.getItem(`category-image-${category}`);
                if (storedImageUrl) {
                    displayCategory(category, storedImageUrl);
                } else {
                    fetch(`https://dummyjson.com/products/category/${category}`)
                        .then(response => response.json())
                        .then(data => {
                            const imageUrl = data.products[0].thumbnail;
                            localStorage.setItem(`category-image-${category}`, imageUrl);
                            displayCategory(category, imageUrl);
                        })
                        .catch(error => console.error('Error fetching category data:', error));
                }
            });
            // Optionally, display products for initial categories
            const initialCategories = categories.slice(0, 3);
            initialCategories.forEach(category => fetchProductsByCategory(category));
        })
        .catch(error => console.error('Error fetching categories:', error));

    function displayCategory(category, imageUrl) {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.innerHTML = `
            <img src="${imageUrl}" alt="${category}" loading="lazy">
            <span>${category}</span>
        `;
        categoryItem.addEventListener('click', () => {
            fetchProductsByCategory(category, false);
            if (promoContainer) {
                promoContainer.style.display = 'none'; // Hide the promo container
            }
        });
        categoryMenu.appendChild(categoryItem);
    }

    function fetchProductsByCategory(category, displayCategoryName = true) {
        fetch(`https://dummyjson.com/products/category/${category}`)
            .then(response => response.json())
            .then(data => {
                if (displayCategoryName) {
                    displayCategoryProducts(category, data.products.slice(0, 5));
                } else {
                    displayProducts(data.products);
                }
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="viewProduct(${product.id})">View</button>
            `;
            productList.appendChild(productCard);
        });
    }

    function displayCategoryProducts(category, products) {
        const categorySection = document.createElement('section');
        categorySection.classList.add('category-section');
        categorySection.innerHTML = `<h2>${category}</h2>`;
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="viewProduct(${product.id})">View</button>
            `;
            productContainer.appendChild(productCard);
        });

        categorySection.appendChild(productContainer);
        productList.appendChild(categorySection);
    }

    window.viewProduct = function (productId) {
        window.location.href = `product.html?id=${productId}`;
    };

    searchButton.addEventListener('click', () => {
        const query = searchBar.value;
        fetch(`https://dummyjson.com/products/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.products);
                if (promoContainer) {
                    promoContainer.style.display = 'none'; // Hide the promo container
                }
            })
            .catch(error => console.error('Error searching products:', error));
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value;
        fetch(`https://dummyjson.com/products/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                displayProducts(data.products);
                if (promoContainer) {
                    promoContainer.classList.add('hidden'); // Hide the promo container
                }
            })
            .catch(error => console.error('Error searching products:', error));
    });

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.querySelectorAll('#cart-count').forEach(countElement => {
            countElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        });
    }

    cartButton.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Fetch and display special deals
    fetchSpecialDeals('beauty');

    function fetchSpecialDeals(category) {
        fetch(`https://dummyjson.com/products/category/${category}`)
            .then(response => response.json())
            .then(data => {
                displaySpecialDeals(data.products.slice(0, 5));
            })
            .catch(error => console.error('Error fetching special deals:', error));
    }

    function displaySpecialDeals(products) {
        const specialProductsContainer = document.getElementById('special-products');
        specialProductsContainer.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" loading="lazy">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="viewProduct(${product.id})">View</button>
            `;
            specialProductsContainer.appendChild(productCard);
        });
    }
});
