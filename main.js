class MainApp {
    constructor() {
        this.initializeProfile();
        this.initializeEventListeners();
    }

    initializeProfile() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const loginBtn = document.getElementById('loginBtn');
        const userProfile = document.getElementById('userProfile');
        const dashboardLink = document.getElementById('dashboardLink');
        
        if (currentUser) {
            loginBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            
            const initials = currentUser.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

            document.getElementById('userAvatar').textContent = initials;
            document.getElementById('userName').textContent = currentUser.name;
            
            const roleElement = document.getElementById('userRole');
            if (roleElement) {
                roleElement.textContent = currentUser.role === 'admin' ? 'Administrator' : 'User';
            }
            
            if (currentUser.role === 'admin' && dashboardLink) {
                dashboardLink.style.display = 'block';
            }
        } else {
            loginBtn.style.display = 'inline-flex';
            userProfile.style.display = 'none';
            if (dashboardLink) {
                dashboardLink.style.display = 'none';
            }
        }
    }

    initializeEventListeners() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    handleLogout() {
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('currentUser');
            alert('Anda telah logout!');
            window.location.href = 'index.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MainApp();
});