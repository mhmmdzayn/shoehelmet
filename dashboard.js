class DashboardApp {
    constructor() {
        this.checkAdminAuth();
        this.initializeProfile();
        this.initializeNavigation();
        this.initializeEventListeners();
        this.loadDashboardData();
    }

    checkAdminAuth() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Anda tidak memiliki akses ke halaman ini!');
            window.location.href = 'index.html';
        }
    }

    initializeProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const initials = currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            
            document.getElementById('adminAvatar').textContent = initials;
            document.getElementById('adminName').textContent = currentUser.name;
        }
    }

    initializeNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = item.dataset.section;
                
                navItems.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
                
                item.classList.add('active');
                document.getElementById(targetSection).classList.add('active');
            });
        });
    }

    initializeEventListeners() {
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        document.getElementById('menuToggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    loadDashboardData() {
        this.loadUsersData();
        this.loadOrdersData();
        this.loadStatistics();
    }

    loadUsersData() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const tbody = document.getElementById('usersTableBody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data user</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>#${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
                <td>${new Date(user.registeredAt || Date.now()).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${user.role !== 'admin' ? `
                    <button class="btn-sm btn-delete" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </td>
            </tr>
        `).join('');
    }

    loadOrdersData() {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const tbody = document.getElementById('ordersTableBody');
        
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada pesanan</td></tr>';
            return;
        }
        
        tbody.innerHTML = bookings.map(booking => `
            <tr>
                <td><strong>${booking.orderId}</strong></td>
                <td>${booking.customerName}</td>
                <td>${booking.serviceName.split(' - ')[0]}</td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(booking.status)}">
                        ${this.getStatusText(booking.status)}
                    </span>
                </td>
                <td>${this.formatCurrency(booking.totalPrice)}</td>
                <td>${new Date(booking.createdAt).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn-sm btn-edit" onclick="viewOrderDetail('${booking.orderId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-sm btn-delete" onclick="deleteOrder('${booking.orderId}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    getStatusBadgeClass(status) {
        const classes = {
            'pending': 'badge-pending',
            'processing': 'badge-processing',
            'completed': 'badge-completed',
            'cancelled': 'badge-cancelled'
        };
        return classes[status] || 'badge-pending';
    }

    getStatusText(status) {
        const texts = {
            'pending': 'Menunggu',
            'processing': 'Diproses',
            'completed': 'Selesai',
            'cancelled': 'Dibatalkan'
        };
        return texts[status] || 'Menunggu';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    loadStatistics() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        document.getElementById('totalUsers').textContent = users.length;
        document.getElementById('adminCount').textContent = users.filter(u => u.role === 'admin').length;
        document.getElementById('regularCount').textContent = users.filter(u => u.role === 'user').length;
        
        document.getElementById('totalOrders').textContent = bookings.length;
        document.getElementById('completedOrders').textContent = bookings.filter(b => b.status === 'completed').length;
        document.getElementById('pendingCount').textContent = bookings.filter(b => b.status === 'pending').length;
        
        const totalRevenue = bookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + b.totalPrice, 0);
        
        document.getElementById('totalRevenue').textContent = this.formatCurrency(totalRevenue);
    }

    handleLogout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }
}

function viewUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    if (user) {
        alert(`User Details:\n\nID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nRegistered: ${new Date(user.registeredAt).toLocaleString('id-ID')}`);
    }
}

function deleteUser(userId) {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const filteredUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
        window.location.reload();
    }
}

function viewOrderDetail(orderId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.orderId === orderId);
    
    if (booking) {
        const details = `Order Details:

Order ID: ${booking.orderId}
Customer: ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone}
Address: ${booking.customerAddress}

Item: ${booking.itemType === 'sepatu' ? 'Sepatu' : 'Helm'}
Service: ${booking.serviceName}
Quantity: ${booking.quantity}
Pickup Date: ${new Date(booking.pickupDate).toLocaleDateString('id-ID')}

Pickup Service: ${booking.pickupService ? 'Yes' : 'No'}
Express: ${booking.expressService ? 'Yes' : 'No'}
Notes: ${booking.notes || '-'}

Total: Rp ${booking.totalPrice.toLocaleString('id-ID')}
Status: ${booking.status.toUpperCase()}
Created: ${new Date(booking.createdAt).toLocaleString('id-ID')}`;
        
        alert(details);
    }
}

function deleteOrder(orderId) {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const filteredBookings = bookings.filter(b => b.orderId !== orderId);
        localStorage.setItem('bookings', JSON.stringify(filteredBookings));
        window.location.reload();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
});