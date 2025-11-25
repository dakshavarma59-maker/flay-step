// Dark Mode
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
});
if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
}

// Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    document.getElementById('cartCount').textContent = cart.reduce((a, item) => a + item.qty, 0);
}
updateCartCount();

document.getElementById('cartBtn').addEventListener('click', () => {
    location.href = 'cart.html';
});

// Shoe Data with Auto-generated Images & Prices
const shoeDatabase = [
    // Sneakers
    { name: "Nike Air Max 270 React", brand: "Nike", type: "sneakers", gender: "men", price: 179, img: "https://source.unsplash.com/random/800x800/?nike,air,max,270" },
    { name: "Adidas Ultraboost 23", brand: "Adidas", type: "sneakers", gender: "men", price: 195, img: "https://source.unsplash.com/random/800x800/?adidas,ultraboost" },
    { name: "Air Jordan 1 Retro High", brand: "Jordan", type: "sneakers", gender: "men", price: 220, img: "https://source.unsplash.com/random/800x800/?jordan,red" },
    { name: "Puma RS-X", brand: "Puma", type: "sneakers", gender: "women", price: 130, img: "https://source.unsplash.com/random/800x800/?puma,women" },

    // Boots
    { name: "Timberland Premium 6\"", brand: "Timberland", type: "boots", gender: "men", price: 198, img: "https://source.unsplash.com/random/800x800/?timberland,boot" },
    { name: "Dr. Martens 1460", brand: "Dr. Martens", type: "boots", gender: "unisex", price: 170, img: "https://source.unsplash.com/random/800x800/?doc,martens" },

    // Sandals & Heels
    { name: "Birkenstock Arizona", brand: "Birkenstock", type: "sandals", gender: "women", price: 110, img: "https://source.unsplash.com/random/800x800/?birkenstock" },
    { name: "Gucci Marmont Heels", brand: "Gucci", type: "heels", gender: "women", price: 890, img: "https://source.unsplash.com/random/800x800/?gucci,heel" },

    // Kids
    { name: "Nike Dynamo Free Kids", brand: "Nike", type: "sneakers", gender: "kids", price: 85, img: "https://source.unsplash.com/random/800x800/?kids,nike" },
    { name: "Crocs Classic Clog Kids", brand: "Crocs", type: "sandals", gender: "kids", price: 45, img: "https://source.unsplash.com/random/800x800/?crocs,kids" },

    // Indian & Regional
    { name: "Bata Power Sports", brand: "Bata", type: "sneakers", gender: "men", price: 69, img: "https://source.unsplash.com/random/800x800/?bata,india" },
    { name: "Liberty Warrior", brand: "Liberty", type: "casual", gender: "men", price: 55, img: "https://source.unsplash.com/random/800x800/?liberty,shoe" },
    { name: "Mochi Bridal Heels", brand: "Mochi", type: "heels", gender: "women", price: 149, img: "https://source.unsplash.com/random/800x800/?mochi,indian" },
];

// Generate 50+ more random premium shoes
for (let i = 0; i < 40; i++) {
    const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Vans", "Converse", "Asics"];
    const types = ["sneakers", "boots", "sandals", "heels", "running"];
    const genders = ["men", "women", "kids"];

    const brand = brands[Math.floor(Math.random() * brands.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];

    let price = 80;
    if (type === "boots") price = Math.floor(Math.random() * 200) + 120;
    else if (type === "heels") price = Math.floor(Math.random() * 600) + 150;
    else price = Math.floor(Math.random() * 150) + 60;

    shoeDatabase.push({
        name: `${brand} ${type.charAt(0).toUpperCase() + type.slice(1)} ${2024 + Math.floor(Math.random() * 2)}`,
        brand, type, gender,
        price,
        img: `https://source.unsplash.com/random/800x800/?${brand.toLowerCase()},${type},shoe,-${i}`
    });
}

// Render Products
const grid = document.getElementById('productsGrid');

function renderProducts(filter = 'all') {
    grid.innerHTML = '';
    const filtered = filter === 'all' ? shoeDatabase : shoeDatabase.filter(s => s.gender === filter || s.gender === 'unisex');

    filtered.forEach((shoe, i) => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl';
        card.innerHTML = `
      <div class="relative group">
        <img src="${shoe.img}" alt="${shoe.name}" class="w-full h-80 object-cover rotate-3d">
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        <button onclick="addToCart(${i})" class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded-full font-bold opacity-0 group-hover:opacity-100 transition translate-y-4 group-hover:translate-y-0">
          Add to Cart
        </button>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold">${shoe.name}</h3>
        <p class="text-gray-500">${shoe.brand}</p>
        <p class="text-3xl font-bold mt-4">$${shoe.price}</p>
      </div>
    `;
        grid.appendChild(card);

        // GSAP Animation on Scroll
        gsap.from(card, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
            }
        });
    });
}

// Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active', 'bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        btn.classList.add('active', 'bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        renderProducts(btn.dataset.filter);
    });
});

// Add to Cart
window.addToCart = function (index) {
    const shoe = shoeDatabase[index];
    const existing = cart.find(item => item.name === shoe.name);
    if (existing) existing.qty++;
    else cart.push({ ...shoe, qty: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Floating animation feedback
    gsap.to('#cartBtn', { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 });
};

// Initial Render
renderProducts();

// GSAP Hero Animations
gsap.to(".floating", { y: -30, rotation: 5, duration: 4, ease: "power1.inOut", yoyo: true, repeat: -1 });
gsap.to(".floating-delay", { y: -40, rotation: -8, duration: 6, ease: "power1.inOut", yoyo: true, repeat: -1 });
gsap.to(".floating-slow", { y: -50, rotation: 10, duration: 8, ease: "power1.inOut", yoyo: true, repeat: -1 });