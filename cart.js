document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Debug log
    loadCart();
    updateCartCount(); // Update the cart count on page load

    const proceedToPaymentButton = document.getElementById('proceed-to-payment');
    const paymentModal = document.getElementById('payment-modal');
    const closeButton = document.getElementById('close-button');
    const cancelButton = document.getElementById('cancel-button');
    const confirmPurchaseButton = document.getElementById('confirm-purchase');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationCloseButton = document.getElementById('confirmation-close-button');
    const confirmationOkButton = document.getElementById('confirmation-ok-button');

    const emptyCartModal = document.getElementById('empty-cart-modal');
    const emptyCartCloseButton = document.getElementById('empty-cart-close-button');
    const emptyCartOkButton = document.getElementById('empty-cart-ok-button');

    proceedToPaymentButton.addEventListener('click', () => {
        if (isCartEmpty()) {
            emptyCartModal.style.display = 'block';
        } else {
            paymentModal.style.display = 'block';
            checkFormCompletion();
        }
    });

    emptyCartCloseButton.addEventListener('click', () => {
        emptyCartModal.style.display = 'none';
    });

    emptyCartOkButton.addEventListener('click', () => {
        emptyCartModal.style.display = 'none';
    });

    closeButton.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        resetPaymentForm();
    });

    cancelButton.addEventListener('click', () => {
        paymentModal.style.display = 'none';
        resetPaymentForm();
    });

    confirmPurchaseButton.addEventListener('click', () => {
        if (checkFormCompletion()) {
            paymentModal.style.display = 'none';
            confirmationModal.style.display = 'block';
            resetPaymentForm();
            clearCart(); // Clear the cart after purchase confirmation
        }
    });

    confirmationCloseButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });

    confirmationOkButton.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        clearCart(); // Clear the cart after clicking "OK" button in the confirmation modal
    });

    window.onclick = (event) => {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
            resetPaymentForm();
        } else if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        } else if (event.target === emptyCartModal) {
            emptyCartModal.style.display = 'none';
        }
    };

    // Add event listeners to form inputs to check form completion
    const paymentForm = document.getElementById('payment-form');
    const formInputs = paymentForm.querySelectorAll('input[required]');
    const errorMessage = document.createElement('p');
    errorMessage.id = 'error-message';
    errorMessage.style.color = 'red';
    errorMessage.style.display = 'none';
    errorMessage.textContent = 'Please fill in all the details.';
    paymentForm.appendChild(errorMessage);

    formInputs.forEach(input => {
        input.addEventListener('input', checkFormCompletion);
    });

    function checkFormCompletion() {
        let allFilled = true;
        formInputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
            }
        });

        confirmPurchaseButton.disabled = !allFilled;
        errorMessage.style.display = allFilled ? 'none' : 'block';

        return allFilled;
    }

});

function isCartEmpty() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length === 0;
}

function resetPaymentForm() {
    const paymentForm = document.getElementById('payment-form');
    paymentForm.reset();
    checkFormCompletion();
}

function clearCart() {
    localStorage.removeItem('cart'); // Clear the cart in local storage
    loadCart(); // Update the cart UI
    updateCartCount(); // Update the cart count
}

function loadCart() {
    console.log('loadCart function called'); // Debug log

    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) {
        console.error('Cart container not found');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart contents:', cart); // Debug log
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
        document.getElementById('subtotal').textContent = 'Subtotal: $0.00';
        return;
    }

    let subtotal = 0;
    cart.forEach(product => {
        subtotal += product.price * product.quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Image"><img src="${product.thumbnail}" alt="${product.title}" style="width: 50px;"></td>
            <td data-label="ID">${product.id}</td>
            <td data-label="Name"><a href="product.html?id=${product.id}" class="cart-product-link">${product.title}</a></td>
            <td data-label="Price">$${product.price.toFixed(2)}</td>
            <td data-label="Quantity">
                <button class="decrease-quantity" data-id="${product.id}">-</button>
                <input type="number" value="${product.quantity}" min="1" data-id="${product.id}" readonly>
                <button class="increase-quantity" data-id="${product.id}">+</button>
            </td>
            <td data-label="Action"><button class="remove-product" data-id="${product.id}">X</button></td>
        `;
        cartContainer.appendChild(row);
    });

    document.getElementById('subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
}

document.getElementById('cart-container').addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('remove-product')) {
        const id = parseInt(target.getAttribute('data-id'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(product => product.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount(); // Ensure this is called after modifying the cart
    } else if (target.classList.contains('decrease-quantity')) {
        const id = parseInt(target.getAttribute('data-id'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(item => item.id === id);
        if (product && product.quantity > 1) {
            product.quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            updateCartCount(); // Ensure this is called after modifying the cart
        }
    } else if (target.classList.contains('increase-quantity')) {
        const id = parseInt(target.getAttribute('data-id'));
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const product = cart.find(item => item.id === id);
        if (product) {
            product.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            updateCartCount(); // Ensure this is called after modifying the cart
        }
    }
});
