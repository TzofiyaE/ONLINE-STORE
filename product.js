document.addEventListener('DOMContentLoaded', () => {
    const productDetails = document.getElementById('product-details');
    if (productDetails) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        fetch(`https://dummyjson.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                preloadImages(product.images);
                displayProductDetails(product);
            })
            .catch(error => console.error('Error fetching product details:', error));
    }

    function preloadImages(images) {
        images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.loading = 'lazy';
        });
    }

    function displayProductDetails(product) {
        let currentImageIndex = 0;

        function updateImage() {
            document.getElementById('main-image').src = product.images[currentImageIndex];
            updateDots();
        }

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentImageIndex);
            });
        }

        function updateThumbnails() {
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach((thumbnail, index) => {
                thumbnail.classList.toggle('active', index === currentImageIndex);
            });
        }

        productDetails.innerHTML = `
            <div class="image-gallery">
                <div class="dots" style="text-align: center; margin-bottom: 10px;">
                    ${product.images.map((_, index) => `<span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>`).join('')}
                </div>
                ${product.images.length > 1 ? '<button id="prev-image">&lt;</button>' : ''}
                <img id="main-image" src="${product.images[currentImageIndex]}" alt="${product.title}" style="max-height: 300px;" loading="lazy">
                ${product.images.length > 1 ? '<button id="next-image">&gt;</button>' : ''}
                <div class="thumbnails" style="display: flex; justify-content: center; margin-top: 10px;">
                    ${product.images.map((src, index) => `<img src="${src}" class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}" style="width: 50px; height: 50px; margin: 0 5px; cursor: pointer;">`).join('')}
                </div>
            </div>
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <p>Price: $${product.price.toFixed(2)}</p>
            <label for="quantity">Quantity:</label>
            <button id="decrease-quantity">-</button>
            <input type="number" id="quantity" value="1" min="1">
            <button id="increase-quantity">+</button>
            <button id="add-to-cart">Add to Cart</button>
            <h3>Reviews</h3>
            <div id="reviews">${getReviewsHTML(product.reviews)}</div>
        `;

        if (product.images.length > 1) {
            document.getElementById('prev-image').addEventListener('click', () => {
                currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : product.images.length - 1;
                updateImage();
                updateThumbnails();
            });

            document.getElementById('next-image').addEventListener('click', () => {
                currentImageIndex = (currentImageIndex < product.images.length - 1) ? currentImageIndex + 1 : 0;
                updateImage();
                updateThumbnails();
            });

            document.querySelectorAll('.dot').forEach(dot => {
                dot.addEventListener('click', () => {
                    currentImageIndex = parseInt(dot.dataset.index);
                    updateImage();
                    updateThumbnails();
                });
            });

            document.querySelectorAll('.thumbnail').forEach(thumbnail => {
                thumbnail.addEventListener('click', () => {
                    currentImageIndex = parseInt(thumbnail.dataset.index);
                    updateImage();
                    updateThumbnails();
                });
            });
        }

        const addToCartButton = document.getElementById('add-to-cart');
        const quantityInput = document.getElementById('quantity');

        document.getElementById('decrease-quantity').addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });

        document.getElementById('increase-quantity').addEventListener('click', () => {
            let quantity = parseInt(quantityInput.value);
            quantityInput.value = quantity + 1;
        });

        addToCartButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(product, quantity);
        });
    }

    function getReviewsHTML(reviews) {
        return reviews.map(review => `
            <div class="review">
                <p><strong>${review.reviewerName}:</strong> ${review.comment}</p>
                <p>Rating: ${review.rating}</p>
                <p>Date: ${new Date(review.date).toLocaleDateString()}</p>
            </div>
        `).join('');
    }

    function addToCart(product, quantity) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                thumbnail: product.thumbnail,
                price: product.price,
                quantity: quantity,
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart');
        updateCartCount();
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.querySelectorAll('#cart-count').forEach(countElement => {
            countElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        });
    }
});

function goToCart() {
    window.location.href = 'cart.html';
}
