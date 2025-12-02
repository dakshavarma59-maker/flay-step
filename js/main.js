// ===== GOOGLE SIGN IN + EMAIL ORDER (ADD THIS AT TOP OF main.js) =====
const firebaseConfig = {
  apiKey: "AIzaSyB7R7vJIvW2p6qGnnhSkpSQjXyodX_cMD4",
  authDomain: "https://flay-step.vercel.app/",
  projectId: "flystep-shoes",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let pendingShoeIndex = null;

function showSignIn() {
  document.getElementById('signInModal').classList.remove('hidden');
}
function hideSignIn() {
  document.getElementById('signInModal').classList.add('hidden');
}

// Google Button
document.getElementById('googleBtn').onclick = () => {
  auth.signInWithPopup(googleProvider).then(() => {
    localStorage.setItem('flystepLogin', 'true');
    hideSignIn();
    addToCartFinal(pendingShoeIndex);
  });
};

// Guest Button
document.getElementById('guestBtn').onclick = () => {
  localStorage.setItem('flystepLogin', 'true');
  hideSignIn();
  addToCartFinal(pendingShoeIndex);
};
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
  { name: "Nike Air Max 270 React", brand: "Nike", type: "sneakers", gender: "men", price: 179, img: "https://images.unsplash.com/photo-1562613521-6b5293e5b0ea?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Adidas Ultraboost 23", brand: "Adidas", type: "sneakers", gender: "men", price: 195, img: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Air Jordan 1 Retro High", brand: "Jordan", type: "sneakers", gender: "men", price: 220, img: "https://images.unsplash.com/photo-1693400652052-884f8dd3dfd9?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Puma RS-X", brand: "Puma", type: "sneakers", gender: "women", price: 130, img: "https://images.unsplash.com/photo-1715693754047-4c0b56576495?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },

  // Boots
  { name: "Timberland Premium 6\"", brand: "Timberland", type: "boots", gender: "men", price: 198, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS8PX_f9qHZnyAlXxRldexbQn-DnBagInXueaLn1KVm44PZCnOFzayrYYzv1_FkLCn5agFoeyoZ8F50QawOGvFHySAuClhnwELudRx97yPDLvPzRKJQm-_O3g" },
  { name: "Dr. Martens 1460", brand: "Dr. Martens", type: "boots", gender: "unisex", price: 170, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSK8dArism5d2dzCoEnjMfg385Uidn7p6_8ci14mdQx8txV5-oyxD0D3Mf1RCzY99SLj7F7bybi2iaBUQxSRSAwL_KB3gekMBNIpOzVyks3Mf37_xbCuB1tzg" },

  // Sandals & Heels
  { name: "Birkenstock Arizona", brand: "Birkenstock", type: "sandals", gender: "women", price: 110, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSndDMwvmWb8IWosKeyBCtf3q-pEZ3_sLxCiYo9ZIpo0sxEg4D4tkxl2Kg-RjncaC5TaBldBH0PsnK1BoO_Qfug4mDH17lCCi11Jh-9xoXXpNA1h89HpSp1Dw" },
  { name: "Gucci Marmont Heels", brand: "Gucci", type: "heels", gender: "women", price: 890, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQLKT2_DTtEBcnVad3OKKp6KYSTOq0rIqckiYwGxlSjySgHfzcTcrm5PmFGcZdxrE_2PUKfUOopCLyzKzo5CtpcSXRV0FCDG3qh6P0qm7vhpJaYJdgSP-QyIec" },

  // Kids
  { name: "Nike Dynamo Free Kids", brand: "Nike", type: "sneakers", gender: "kids", price: 85, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSienDVZdowASPyCaWA-IrKhRFSFxKl9RqTeL1Vu6kzEWCPa0cnTDKg6h9Rsu-8QeaBTfBZgh8-uwx8xakHW1WTE0U9e5KS90FLy5S1mqxlp-YO1sal0o5L" },
  { name: "Crocs Classic Clog Kids", brand: "Crocs", type: "sandals", gender: "kids", price: 45, img: "https://images.unsplash.com/photo-1714935101713-d6f6da0e2c4b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },

  // Indian & Regional
  { name: "Bata Power Sports", brand: "Bata", type: "sneakers", gender: "men", price: 69, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS2pHDbuK7PoMT-yWPfDS2ubN9Um3DXrupXN_Jq8CB5zGntH000KfiqQMRNpwmAR6RcAfkZv6p_piVhTJDruqGA5PW3Hmld60FSRYj8_7q0sB992gH_uwJjv-A" },
  { name: "Liberty Warrior", brand: "Liberty", type: "casual", gender: "men", price: 55, img: "https://images.unsplash.com/photo-1608256255256-411200dde1ee?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Mochi Bridal Heels", brand: "Mochi", type: "heels", gender: "women", price: 149, img: "https://images.unsplash.com/photo-1745270084565-4a87ea2dcaaf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },

  { name: "Asics Sneakers 2024", brand: "Asics", type: "sneakers", gender: "men", price: 189, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS5nS5_o99phHO4-1dY_i7XlHFnqLioVEEcOBNxYLuPeDJBs_lYFD2mnKxOb7XwYnqMKG_0tM6xU6EDycgTrwFRCITyiElwHGw9D8sheU6qMcec4QeSiql3dg" },
  { name: "Asics Running 2025", brand: "Asics", type: "running", gender: "men", price: 199, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTVEddkNuhObv9Zv3Z3qvnL8VnZ8zWjMy672DCrRxhE17dKA3IwwoIEMzvUDCdycjieb37pZwvM1yDMC-b7MSExVI4yZdOD0g_gDT4gun5tGplETxozVAv8" },
  { name: "Asics Sandals 2024", brand: "Asics", type: "sandals", gender: "unisex", price: 79, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSAxXs7_29o1p6mKOrbgt7NCxSNe7O-Bp5k-ZIvO8uxNtk7LFrXDWJcJ5IyJ0WjpFMAtLWhTn6o7T5yx6wO5il77TB8R8ZfsL0HrcGUcCYV2kKbzkcal1kdIQ" },
  { name: "Nike Sneakers 2024", brand: "Nike", type: "sneakers", gender: "men", price: 199, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT1jdCHqncqhcu2AWlkMyQW_I2cYlrxicSS5nQLwJAHf0OElEr3omz6vA_1ObfuazwbsiisgUJo6yNhJSCCrwWq3rp4Nt8mWB93-IWpa0CRN2I_VPQcOAIQxg" },
  { name: "Converse Running 2024", brand: "Converse", type: "running", gender: "unisex", price: 129, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcS7vdXuuaoChtoBRqThEo9fclmB3XfhYG62gbRq7tdVieJYBt0cM3C4WgzOGiLN2wnFDsy7vGkWMAIwq2xeIj98syZEwAq3dvEG8jradDQVRdoKGxppiPXEYSY" },
  { name: "Vans Sandals 2024", brand: "Vans", type: "sandals", gender: "unisex", price: 79, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRoxhmjW7uDmA-IIizmtaJhXurYpRufV8iEXEo1t-SDi6-TaBRGVdzFCU-MBz5_2dMJ7n_xE06mjEF60RmI7rRx8z0yWEq3w6AiEZbftPA" },
  { name: "Reebok Sandals 2024", brand: "Reebok", type: "sandals", gender: "men", price: 89, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTmuHExWENITsPoLPVssceNyZNlfVFSNF3y7odPZY9z7-G2NcLPgHsTiZNJfLpyRHWamf1tSVE3H3VVc9E5Y5bnlXSFQ8zvI5P-isrnR_6QBk2VNiJozCMZkA" },
  { name: "Asics Boots 2025", brand: "Asics", type: "boots", gender: "men", price: 249, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRPSUs3XLsBc8tG5JHIJ6SYsmAnlJGZcd1shVbuT4mq10mrBXyifLmWM42KZwd3cG7zJkk-v5C-k5ySj81G6UKMz9FP4Q0hzttXf0G1nt0z" },
  { name: "Adidas Boots 2025", brand: "Adidas", type: "boots", gender: "men", price: 269, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSfcZ4Ak88l3MAfYPhJYtcrDA4Lj7lHddh1O3f0EDY02KDmg7610eqhzXv2RUwacQQSUgzqnQSRP76AZK1F69U6dzlWGiia" },
  { name: "New Balance Heels 2024", brand: "New Balance", type: "heels", gender: "women", price: 189, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSOLYs3dHauPLDtZ107bWS83_vIaVBf2ZqyC74j85hsd92VqMnPhAAlb2BX8av5fPaRdKSZjFtXpyZVxYcwQCmmHbiWlvKN8NeH-R25ewFgN64CoQBHBjxWgQ" },
  { name: "Vans Boots 2025", brand: "Vans", type: "boots", gender: "unisex", price: 179, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS4uDP5svIO6Q02LMp6W8JfdkMUZH-0oEWd9CAd3wl8MFuBbK8R-ADg3xgGunldFhN8VZD5gG4d5ZiBhR6NE4nBMXMyXH47nAoSiarl68hlHsEEV1YdfN5m" },
  { name: "Reebok Running 2024", brand: "Reebok", type: "running", gender: "unisex", price: 139, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcStT4coVYMmryUDX91AYGdgo6FL_MCmnsH9ELgltzHEhlyYwQP141NGoffCltpND8BvMLQ390UPH_zgGncl-nt4ihl8YX-PO6kW8JdqL9sWZEVuoGL76yqSuXQ" },
  { name: "Reebok Boots 2024", brand: "Reebok", type: "boots", gender: "men", price: 219, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR6IBRnXOKX5-Tf-Eqb_ZupFs6Tdjg6O-ZjC__jyUj26OYFhkPAh9mjB8-B6UEg4niys3Q3jHLuJ_9AhPfLRDvHRHjU7LrA0wM2u_g1jTCYyLLF3oJRmfmp" },
  { name: "Adidas Sandals 2024", brand: "Adidas", type: "sandals", gender: "unisex", price: 59, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQDoqNUkmHxqIc18r_JyfEPC0OXzkgwDoLFbATKSlkZgR89vpkZhI6XDrsCaxR83GxhKakg_IcmyaqIseDtYjmyJRi5ELA05tRfnoZLvI2u-MTBgyHpqN4xMw" },
  { name: "New Balance Boots 2024", brand: "New Balance", type: "boots", gender: "unisex", price: 199, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT7f4v970cQcw3qCZI6mt7r-gYsm_1KbOZT1blYNaBovzCbrEq6GU01RjRJOTCmAx6JIkvvtuPypyHmYr53EIz6vQzRFRkxZv61wRsWlalyoFg4DCgytEWD" },
  { name: "Nike Boots 2025", brand: "Nike", type: "boots", gender: "men", price: 289, img: "https://images.unsplash.com/photo-1585147877975-6acd0a929a46?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Adidas Sneakers 2025", brand: "Adidas", type: "sneakers", gender: "unisex", price: 399, img: "https://images.unsplash.com/photo-1651013691313-81b822df0044?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Reebok Heels 2025", brand: "Reebok", type: "heels", gender: "women", price: 229, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR4CQ555hpbreUh4OvnoKv5gx_2uEMFvK_j0WfL7SjrpXhPyNmZHCDV4btsEBhalLwSfKd0MsRLZrXAXnhUTFNB5NBNksmPgQnyk2YJ9-U" },
  { name: "Nike Sandals 2024", brand: "Nike", type: "sandals", gender: "women", price: 99, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcS6PryTpqS3Y2N-34kaAg5d8jBDgktIZ3nQQpsG63os6BIeiNGQKWIpT6WddqQcF5A8sc33ZZMjjWrFzkbcvlL1AAPhVE9Izqyt4BFU2wh9QjbFfOYHLXyzb_0" },
  { name: "Reebok Sandals 2025", brand: "Reebok", type: "sandals", gender: "unisex", price: 95, img: "https://media.landmarkshops.in/cdn-cgi/image/h=1125,w=1125,q=85,fit=cover/lifestyle/1000015648668-Green-Green-1000015648668_01-2100.jpg" },
  { name: "Reebok Sneakers 2024", brand: "Reebok", type: "sneakers", gender: "men", price: 149, img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTh-SgZ0dWmLEDABft91OTYd_siBCgxuXGsdMOpROD2CE-wYJ6pB0bBNGkCu7-muR_nG04W4GW7J3knRIIxRjiJDTTx5l5BkklupGIz4G1AYL4BAPWzW_HoZA" },
  { name: "Converse Running 2025", brand: "Converse", type: "running", gender: "unisex", price: 149, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSob8-ZYN0qGrP5Hzbr87bnkbQXeLi_NM3VoTGZku_YCXE9ph4tkhk7OhncbpKkFEC0afpm205EdFc5ew5z46TvNBqRoWqo2V2QgFtSN-2NyODwjuqY2DwvDAA" },
  { name: "Nike Running 2024", brand: "Nike", type: "running", gender: "men", price: 209, img: "https://images.unsplash.com/photo-1585063395665-b8ad4acbb9af?q=80&w=718&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "New Balance Running 2025", brand: "New Balance", type: "running", gender: "unisex", price: 179, img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQvQhoAv3jhgAdZiBJYAv5gGkZyywivIe91zBaVh4yLa9G5ZeFycCn7EpYCQqziG89h98x3B83eXXTkw0qz-bDiTWXN4q-QcAdC0f9gZyI" },
  { name: "Puma Sneakers 2025", brand: "Puma", type: "sneakers", gender: "men", price: 169, img: "https://images.unsplash.com/photo-1632993819204-3ad5253a4a72?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Puma Sandals 2024", brand: "Puma", type: "sandals", gender: "men", price: 79, img: "https://images.unsplash.com/photo-1612387605285-7ee92eae6958?q=80&w=487&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "New Balance Heels 2025", brand: "New Balance", type: "heels", gender: "women", price: 199, img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcR4CQ555hpbreUh4OvnoKv5gx_2uEMFvK_j0WfL7SjrpXhPyNmZHCDV4btsEBhalLwSfKd0MsRLZrXAXnhUTFNB5NBNksmPgQnyk2YJ9-U" },
  { name: "Vans Sneakers 2025", brand: "Vans", type: "sneakers", gender: "unisex", price: 119, img: "https://images.unsplash.com/photo-1627532383712-981b37b4085c?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Reebok Heels 2024", brand: "Reebok", type: "heels", gender: "women", price: 199, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQKl8yv8IChDba6d3DuA2YE-ZpgXI-7JNFuqmap1_eB6frmed3JOaTyNv3cL2ptdIcbkGiZuI-LkCjiq3ljTe1KpJqKpJmlxcPkUBjDVoN-m5i2j8jgZqGzJw" },
  { name: "New Balance Running 2024", brand: "New Balance", type: "running", gender: "unisex", price: 169, img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTNDesGD0abrkLhFTUChxw8cOby4tj6dbohdh-YlSCEkjIQro81zcQiY44aswy8BG6Fa_I5eyIJ-T9c5xAcIyK84hjP1p_yJLX0E1guHdwv5Vg9QQGJ8glw2g" },
  { name: "Nike Sneakers 2025", brand: "Nike", type: "sneakers", gender: "men", price: 229, img: "https://images.unsplash.com/photo-1656944227480-98180d2a5155?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];


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

// YE PURA REPLACE KAR DO (addToCart function)
window.addToCart = function (index) {
  if (localStorage.getItem('flystepLogin') === 'true') {
    addToCartFinal(index);
  } else {
    pendingShoeIndex = index;
    showSignIn();
  }
};

function addToCartFinal(index) {
  const shoe = shoeDatabase[index];
  const existing = cart.find(item => item.name === shoe.name);
  if (existing) existing.qty++;
  else cart.push({ ...shoe, qty: 1 });

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  gsap.to('#cartBtn', { scale: 1.4, duration: 0.3, yoyo: true, repeat: 1 });
}

// Floating animation feedback
gsap.to('#cartBtn', { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 });


// Initial Render
renderProducts();

// GSAP Hero Animations
gsap.to(".floating", { y: -30, rotation: 5, duration: 4, ease: "power1.inOut", yoyo: true, repeat: -1 });
gsap.to(".floating-delay", { y: -40, rotation: -8, duration: 6, ease: "power1.inOut", yoyo: true, repeat: -1 });
gsap.to(".floating-slow", { y: -50, rotation: 10, duration: 8, ease: "power1.inOut", yoyo: true, repeat: -1 });
