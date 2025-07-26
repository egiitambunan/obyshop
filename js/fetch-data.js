let produkData = [];

async function fetchProduk() {
  try {
    const res = await fetch("https://obyshop-backend-production-4831.up.railway.app/api/products");
    const data = await res.json();

    produkData = data.map(p => ({
      nama: p.nama || p.name,
      harga: p.harga || p.price,
      gambar: https://obyshop-backend-production-4831.up.railway.app/uploads/products/${p.imageFilename},
    }));
  } catch (err) {
    console.error("❌ Gagal mengambil produk:", err);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Ambil konten umum dari backend
    const res = await fetch("https://obyshop-backend-production-4831.up.railway.app/api/content");
    const content = await res.json();

    // Hero Section
    if (content.heroTitle) document.getElementById("hero-title").innerHTML = content.heroTitle;
    if (content.heroSubtitle) document.getElementById("hero-subtitle").textContent = content.heroSubtitle;
    if (content.heroTitleColor) document.getElementById("hero-title").style.color = content.heroTitleColor;
    if (content.heroSubtitleColor) document.getElementById("hero-subtitle").style.color = content.heroSubtitleColor;
    if (content.heroBackgroundImage) {
      const hero = document.querySelector(".hero");
      if (hero) {
        hero.style.backgroundImage = `url(https://obyshop-backend-production-4831.up.railway.app${content.heroBackgroundImage})`;
        hero.style.backgroundSize = "cover";
        hero.style.backgroundPosition = "center";
      }
    }

    // Tentang Kami (Video)
    if (Array.isArray(content.aboutVideos)) {
      content.aboutVideos.forEach((video, index) => {
        const wrapper = document.getElementById(`videoWrapper${index + 1}`);
        const title = document.getElementById(`title${index + 1}`);
        const desc = document.getElementById(`desc${index + 1}`);

        if (title && video.title) title.textContent = video.title;
        if (desc && video.desc) desc.textContent = video.desc;

        if (wrapper && video.videoUrl) {
          wrapper.innerHTML = "";

          // Cek apakah link YouTube
          if (video.videoUrl.startsWith("http") && video.videoUrl.includes("youtube.com")) {
            const iframe = document.createElement("iframe");
            iframe.src = video.videoUrl.replace("watch?v=", "embed/") + "?autoplay=0&mute=1";
            iframe.frameBorder = 0;
            iframe.allow = "autoplay; encrypted-media";
            iframe.allowFullscreen = true;
            iframe.style.width = "100%";
            iframe.style.aspectRatio = "16/9";
            wrapper.appendChild(iframe);
          } else {
            const videoEl = document.createElement("video");
            videoEl.src = video.videoUrl.startsWith("/")
              ? `http://localhost:5000${video.videoUrl}`
              : video.videoUrl;
            videoEl.controls = true;
            videoEl.playsInline = true;
            videoEl.autoplay = false;
            videoEl.muted = false;
            videoEl.style.width = "100%";
            wrapper.appendChild(videoEl);
          }
        }
      });
    }

    // Kontak
    if (content.contactInfo?.phone) {
      const el = document.getElementById("contact-phone");
      if (el) {
        el.textContent = content.contactInfo.phone;
        el.href = `https://wa.me/${content.contactInfo.phone}`;
      }
    }
    if (content.contactInfo?.email) {
      const el = document.getElementById("contact-email");
      if (el) {
        el.textContent = content.contactInfo.email;
        el.href = `mailto:${content.contactInfo.email}`;
      }
    }
    if (content.contactInfo?.address) {
      const el = document.getElementById("contact-address");
      if (el) el.textContent = content.contactInfo.address;
    }

    // WhatsApp Bubble & Button
    if (content.whatsapp?.bubbleButton) {
  whatsappBubbleNumber = content.whatsapp.bubbleButton;
}

    if (content.whatsapp?.contactButton) {
      const cta = document.querySelector(".contact .cta");
      if (cta) cta.href = `https://wa.me/${content.whatsapp.contactButton}`;
    }

    // Social Media
    if (content.socialMedia?.instagram) {
      const el = document.querySelector(".socials .fa-instagram");
      if (el?.parentElement) el.parentElement.href = content.socialMedia.instagram;
    }
    if (content.socialMedia?.facebook) {
      const el = document.querySelector(".socials .fa-facebook");
      if (el?.parentElement) el.parentElement.href = content.socialMedia.facebook;
    }
    if (content.socialMedia?.tiktok) {
      const el = document.querySelector(".socials .fa-tiktok");
      if (el?.parentElement) el.parentElement.href = content.socialMedia.tiktok;
    }

    // Warna Tema
    if (content.theme?.primaryColor) {
      document.documentElement.style.setProperty("--primary", content.theme.primaryColor);
    }
    if (content.theme?.backgroundColor) {
      document.documentElement.style.setProperty("--bg", content.theme.backgroundColor);
    }
  } catch (err) {
    console.error("❌ Gagal mengambil konten:", err);
  }

  // Produk
  try {
    const res = await fetch("https://obyshop-backend-production-4831.up.railway.app/api/products");
    const products = await res.json();
    const container = document.getElementById("produk-terbaru");
    if (!container) return;

    container.innerHTML = "";

    // Kelompokkan produk berdasarkan kategori (1 per kategori)
    const kategoriMap = {};
    products.forEach((p) => {
      if (!kategoriMap[p.kategori]) {
        kategoriMap[p.kategori] = p;
      }
    });

    // Ambil 2 produk terbaru atau unggulan
    const tambahan = products
      .filter(p => p.produkBaru || p.produkUtama)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);

    // Gabungkan & hilangkan duplikat berdasarkan _id
    const tampilkan = [...Object.values(kategoriMap), ...tambahan].filter(
      (v, i, arr) => arr.findIndex(p => p._id === v._id) === i
    );

    // Tampilkan produk ke HTML
    tampilkan.forEach((p) => {
      const div = document.createElement("div");
      div.className = "menu-card";
      div.innerHTML = `
        <img src="https://obyshop-backend-production-4831.up.railway.app/uploads/products/${p.imageFilename}" alt="${p.nama || p.name}" class="menu-card-img" />
        <h3 class="menu-card-title">- ${p.nama || p.name} -</h3>
        <p class="menu-card-price">Rp ${(p.harga || p.price).toLocaleString("id-ID")}</p>
        <button onclick="addToCart('${p._id}', '${p.nama || p.name}', ${p.harga || p.price})">Tambah ke Keranjang</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error("❌ Gagal mengambil produk:", err);
  }
});

// Tambah ke keranjang
function addToCart(id, nama, harga) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const index = cart.findIndex(item => item.id === id);
  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    cart.push({ id, nama, harga, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk ditambahkan ke keranjang!");
}
