document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.querySelectorAll('#cart-count').forEach(countElement => {
        countElement.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    });
}
