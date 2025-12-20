document.addEventListener('DOMContentLoaded', function() {
    const scheduleButton = document.getElementById('schedule-button');
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("img-full");
    const closeBtn = document.querySelector(".close");
    const images = document.querySelectorAll(".gallery img");

    images.forEach(img => {
    img.onclick = function() {
            modal.style.display = "flex"; // Tampilkan modal
         modalImg.src = this.src;      // Masukkan foto yang diklik ke modal
        }
    });

    // Tutup modal saat tombol 'x' diklik
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

// Tutup modal saat area hitam diklik
    modal.onclick = function(e) {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    }

    if (scheduleButton) {
        scheduleButton.addEventListener('click', function() {
            // Logika saat tombol diklik.
            // Di sini, kita bisa mengarahkan ke halaman pemesanan atau menampilkan pop-up.
            
            // Contoh: Mengarahkan ke WhatsApp (Ganti nomor dengan nomor bisnis Anda)
            const phoneNumber = '6281234567890'; // Contoh: Ganti dengan nomor WhatsApp
            const message = 'Halo ShoeHelmet.id, saya ingin menjadwalkan cuci sepatu. Mohon informasinya.';
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
            
            console.log('Tombol Jadwalkan Cuci Sepatu diklik dan diarahkan ke WhatsApp.');
            alert('Anda akan diarahkan ke WhatsApp untuk menjadwalkan layanan.');
        });
    }
    // JS untuk menambahkan efek active pada menu saat di-scroll (Jika ingin lebih lanjut)
    const sections = document.querySelectorAll('section, main');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
