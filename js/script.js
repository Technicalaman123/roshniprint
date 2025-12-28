// js/script.js

// ----------- NEW FUNCTIONS FOR MENU & SEARCH -----------

// Side menu ko kholne/band karne ke liye
function toggleMenu() {
    document.getElementById('sideMenu').classList.toggle('open');
}

// Product search karne ke liye
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const productGrid = document.getElementById('productGrid');
    
    const filteredProducts = products.filter(product => 
        product.name && product.name.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length > 0) {
        productGrid.innerHTML = filteredProducts.map(createProductCard).join('');
    } else {
        productGrid.innerHTML = '<p>No products found matching your search.</p>';
    }
}


// ----------- EXISTING CODE (with some improvements) -----------

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    if(searchButton){
        searchButton.addEventListener('click', searchProducts);
    }

    const searchInput = document.getElementById('searchInput');
    if(searchInput){
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                searchProducts();
            }
        });
    }

    const path = window.location.pathname.split("/").pop();

    if (path === 'index.html' || path === '') {
        loadHomePage();
    } else if (path === 'category.html') {
        loadCategoryPage();
    } else if (path === 'product.html') {
        loadProductPage();
    }
});

// Helper function: Product card banane ke liye
function createProductCard(product) {
    const imgSrc = product.images && product.images[0] ? product.images[0] : "https://via.placeholder.com/150";
    const isAvailable = product.inStock !== undefined && product.inStock ? true : false;

    return `
        <a href="product.html?id=${product.id}" class="product-card">
            <img src="${imgSrc}" alt="${product.name || 'Unnamed Product'}">
            <div class="product-card-info">
                <h3>${product.name || 'Unnamed Product'}</h3>
                <p class="price">₹${product.price !== undefined ? product.price.toFixed(2) : '0.00'}</p>
                <p class="in-stock">${isAvailable ? '✅ In Stock' : '❌ Out of Stock'}</p>
            </div>
        </a>
    `;
}

// Home page par products aur categories load karne ka function
function loadHomePage() {
    const productGrid = document.getElementById('productGrid');
    const categoryLinks = document.getElementById('categoryLinks');

    if (productGrid) {
        productGrid.innerHTML = products.map(createProductCard).join('');
    }
    
    if (categoryLinks) {
        const categories = [...new Set(products.map(p => p.category))];
        categoryLinks.innerHTML = categories.map(cat => 
            `<a href="category.html?name=${encodeURIComponent(cat)}">${cat}</a>`
        ).join('');
    }
}

// Category page par products load karne ka function
function loadCategoryPage() {
    const productGrid = document.getElementById('productGrid');
    const categoryTitle = document.getElementById('categoryTitle');
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('name');

    if (categoryName && productGrid && categoryTitle) {
        categoryTitle.textContent = categoryName;
        const categoryProducts = products.filter(p => p.category === categoryName);

        if (categoryProducts.length > 0) {
            productGrid.innerHTML = categoryProducts.map(createProductCard).join('');
        } else {
            productGrid.innerHTML = `<p>No products found in this category.</p>`;
        }
    }
}

// Product detail page
function loadProductPage() {
    const container = document.getElementById('productDetailContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (productId && container) {
        const product = products.find(p => p.id === productId);

        if (product) {
            document.title = `${product.name || 'Unnamed Product'} - Roshni Prnit`;

            const isAvailable = product.inStock !== undefined && product.inStock ? true : false;

            let thumbnailsHTML = (product.images || []).map((img, index) => 
                `<img src="${img}" alt="thumbnail ${index + 1}" class="${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">`
            ).join('');
            
            container.innerHTML = `
                <div class="product-detail-layout">
                    <div class="product-images">
                        <div class="main-image">
                            <img id="mainProductImage" src="${(product.images && product.images[0]) || 'https://via.placeholder.com/300'}" alt="${product.name || 'Unnamed Product'}">
                        </div>
                        <div class="thumbnail-images">
                            ${thumbnailsHTML}
                        </div>
                    </div>
                    <div class="product-info">
                        <h1>${product.name || 'Unnamed Product'}</h1>
                        <div class="price-container">
                            <span class="new-price">₹${product.price !== undefined ? product.price.toFixed(2) : '0.00'}</span>
                            <span class="old-price">₹${product.oldPrice !== undefined ? product.oldPrice.toFixed(2) : '0.00'}</span>
                        </div>
                        <p class="description">${product.description || 'No description available'}</p>
                        <ul class="details-list">
                            <li><strong>Color:</strong> ${product.details && product.details.color ? product.details.color : 'N/A'}</li>
                            <li><strong>Availability:</strong> ${isAvailable ? '✅ In Stock' : '❌ Out of Stock'}</li>
                            <li><strong>Shipping:</strong> ${product.details && product.details.shipping ? product.details.shipping : 'N/A'}</li>
                        </ul>
                        <a href="https://wa.me/9166335565082?text=I want to buy the product: ${encodeURIComponent(product.name || 'Unnamed Product')}" target="_blank" class="buy-now-btn">Buy Now on WhatsApp</a>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `<p class="section-title">Product not found!</p>`;
        }
    }
}

// Change main product image
function changeImage(newSrc, clickedThumbnail) {
    document.getElementById('mainProductImage').src = newSrc;
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    clickedThumbnail.classList.add('active');
}
