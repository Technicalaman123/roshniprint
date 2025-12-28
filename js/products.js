// js/products.js

let products = []; // Global variable jisse script.js access kare

async function fetchProducts() {
  const url = 'https://api.airtable.com/v0/apprw7BEDhrSZm93Q/tblhT5AEyQ5Ihyi8W';
  const apiKey = 'patEcLoHTFgHhUxWC.83145a35eaee2080196d25af8b7588e46054c22244ce9e20fc1442030dd0ba79';

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = await response.json();
    console.log('Full response:', data);

    // Airtable data ko products array me transform karna
    products = data.records.map(r => {
      const f = r.fields;
      return {
        id: f.id || r.id, 
        name: f["product name"] || f.Name || "Unnamed Product",
        category: f.category || "N/A",
        price: f.price || 0,
        oldPrice: f.oldPrice || f.OldPrice || 0,
        rating: f.rating || 0,
        inStock: f.inStock === true,
        description: f.description || "No description",
        details: {
          color: f.color || "N/A",
          shipping: f.shipping || "N/A",
          fee: f.fee || "N/A",
        },
        images: f.images ? f.images.map(img => img.url || img) : ["https://via.placeholder.com/150"]
      };
    });

    // Page load hone par products show karna
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
      loadHomePage();
    } else if (window.location.pathname.endsWith('category.html')) {
      loadCategoryPage();
    } else if (window.location.pathname.endsWith('product.html')) {
      loadProductPage();
    }

  } catch (error) {
    console.error('Fetch error:', error);
  }
}

fetchProducts();
