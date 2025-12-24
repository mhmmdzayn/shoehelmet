class BookingSystem {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.initializeEventListeners();
        this.initializeDatePicker();
        this.loadUserData();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBooking();
        });

        document.getElementById('itemType').addEventListener('change', () => this.updateSummary());
        document.getElementById('serviceType').addEventListener('change', () => this.updateSummary());
        document.getElementById('quantity').addEventListener('input', () => this.updateSummary());
        document.getElementById('pickupDate').addEventListener('change', () => this.updateSummary());
        document.getElementById('pickupService').addEventListener('change', () => this.updateSummary());
        document.getElementById('expressService').addEventListener('change', () => this.updateSummary());
    }

    initializeDatePicker() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateInput = document.getElementById('pickupDate');
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    loadUserData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            document.getElementById('customerName').value = currentUser.name;
            document.getElementById('customerEmail').value = currentUser.email;
        }
    }

    updateSummary() {
        const itemType = document.getElementById('itemType');
        const serviceType = document.getElementById('serviceType');
        const quantity = parseInt(document.getElementById('quantity').value) || 0;
        const pickupDate = document.getElementById('pickupDate').value;
        const pickupService = document.getElementById('pickupService').checked;
        const expressService = document.getElementById('expressService').checked;

        document.getElementById('summaryItemType').textContent = 
            itemType.options[itemType.selectedIndex].text || '-';
        
        document.getElementById('summaryService').textContent = 
            serviceType.options[serviceType.selectedIndex].text.split(' - ')[0] || '-';
        
        document.getElementById('summaryQuantity').textContent = quantity || 0;
        
        document.getElementById('summaryDate').textContent = 
            pickupDate ? new Date(pickupDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : '-';

        let basePrice = 0;
        if (serviceType.value) {
            basePrice = parseInt(serviceType.options[serviceType.selectedIndex].dataset.price) || 0;
        }

        const serviceTotal = basePrice * quantity;
        const pickupPrice = pickupService ? 15000 : 0;
        const expressPrice = expressService ? 25000 : 0;
        const totalPrice = serviceTotal + pickupPrice + expressPrice;

        document.getElementById('summaryServicePrice').textContent = this.formatCurrency(serviceTotal);

        const pickupRow = document.getElementById('pickupPriceRow');
        const expressRow = document.getElementById('expressPriceRow');
        
        pickupRow.style.display = pickupService ? 'flex' : 'none';
        expressRow.style.display = expressService ? 'flex' : 'none';

        document.getElementById('summaryTotal').textContent = this.formatCurrency(totalPrice);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    validateForm() {
        let isValid = true;
        const errors = {};

        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        const name = document.getElementById('customerName').value.trim();
        if (name.length < 3) {
            errors.name = 'Nama minimal 3 karakter';
            isValid = false;
        }

        const email = document.getElementById('customerEmail').value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = 'Email tidak valid';
            isValid = false;
        }

        const phone = document.getElementById('customerPhone').value.trim();
        if (phone.length < 10) {
            errors.phone = 'Nomor WhatsApp tidak valid';
            isValid = false;
        }

        const address = document.getElementById('customerAddress').value.trim();
        if (address.length < 10) {
            errors.address = 'Alamat terlalu singkat';
            isValid = false;
        }

        const itemType = document.getElementById('itemType').value;
        if (!itemType) {
            errors.itemType = 'Pilih jenis item';
            isValid = false;
        }

        const serviceType = document.getElementById('serviceType').value;
        if (!serviceType) {
            errors.service = 'Pilih jenis layanan';
            isValid = false;
        }

        const quantity = parseInt(document.getElementById('quantity').value);
        if (quantity < 1) {
            errors.quantity = 'Jumlah minimal 1';
            isValid = false;
        }

        const pickupDate = document.getElementById('pickupDate').value;
        if (!pickupDate) {
            errors.date = 'Pilih tanggal pickup';
            isValid = false;
        }

        Object.keys(errors).forEach(key => {
            const errorElement = document.getElementById(`${key}Error`);
            if (errorElement) {
                errorElement.textContent = errors[key];
            }
        });

        return isValid;
    }

    handleBooking() {
        if (!this.validateForm()) {
            alert('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        const bookingData = {
            orderId: 'ORD-' + Date.now(),
            customerName: document.getElementById('customerName').value.trim(),
            customerEmail: document.getElementById('customerEmail').value.trim(),
            customerPhone: document.getElementById('customerPhone').value.trim(),
            customerAddress: document.getElementById('customerAddress').value.trim(),
            itemType: document.getElementById('itemType').value,
            serviceType: document.getElementById('serviceType').value,
            serviceName: document.getElementById('serviceType').options[document.getElementById('serviceType').selectedIndex].text,
            quantity: parseInt(document.getElementById('quantity').value),
            pickupDate: document.getElementById('pickupDate').value,
            pickupService: document.getElementById('pickupService').checked,
            expressService: document.getElementById('expressService').checked,
            notes: document.getElementById('notes').value.trim(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            totalPrice: this.calculateTotal()
        };

        this.saveBooking(bookingData);
        this.showSuccessModal(bookingData);
    }

    calculateTotal() {
        const serviceType = document.getElementById('serviceType');
        const quantity = parseInt(document.getElementById('quantity').value);
        const pickupService = document.getElementById('pickupService').checked;
        const expressService = document.getElementById('expressService').checked;

        let basePrice = 0;
        if (serviceType.value) {
            basePrice = parseInt(serviceType.options[serviceType.selectedIndex].dataset.price);
        }

        const serviceTotal = basePrice * quantity;
        const pickupPrice = pickupService ? 15000 : 0;
        const expressPrice = expressService ? 25000 : 0;

        return serviceTotal + pickupPrice + expressPrice;
    }

    saveBooking(bookingData) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    showSuccessModal(bookingData) {
        const modal = document.getElementById('successModal');
        const orderIdElement = document.getElementById('modalOrderId');
        const whatsappBtn = document.getElementById('whatsappBtn');

        orderIdElement.textContent = bookingData.orderId;

        const message = `Halo Admin ShoeHelmet.ID,%0A%0ASaya ingin konfirmasi booking:%0A%0A` +
            `Order ID: ${bookingData.orderId}%0A` +
            `Nama: ${bookingData.customerName}%0A` +
            `Layanan: ${bookingData.serviceName}%0A` +
            `Jumlah: ${bookingData.quantity}%0A` +
            `Total: ${this.formatCurrency(bookingData.totalPrice)}%0A%0A` +
            `Terima kasih!`;

        whatsappBtn.href = `https://wa.me/6285881872733?text=${message}`;
        modal.classList.add('active');
    }
}

function redirectToHome() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
});