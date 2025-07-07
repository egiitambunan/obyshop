// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// ketika Aksesoris menu di klik
document.querySelector("#Aksesoris-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// klik di luar sidebar untuk menghilangkan nav
const Aksesoris = document.querySelector("#Aksesoris-menu");

document.addEventListener("click", function (e) {
  if (!Aksesoris.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Fungsi cari produk dan arahkan ke halaman menu
document.getElementById("searchBtn").addEventListener("click", () => {
  const keyword = document.getElementById("searchInput").value.trim();
  if (keyword !== "") {
    window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
  }
});

// Fungsi tampilkan isi keranjang dummy
document.getElementById("shopping-cart").addEventListener("click", () => {
  window.location.href = "cart.html";
});

// Tampilkan pertanyaan saat klik ikon WA
document.querySelector(".wa-icon").addEventListener("click", function (e) {
  e.preventDefault();
  const box = document.querySelector(".wa-questions");
  box.style.display = box.style.display === "block" ? "none" : "block";
});

// Fungsi kirim ke WA dengan pertanyaan otomatis
function sendWA(pesan) {
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const index = cart.findIndex((item) => item.id === id);
  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk ditambahkan ke keranjang!");
}




