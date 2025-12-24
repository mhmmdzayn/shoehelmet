class AuthSystem {
    constructor() {
        this.initializeDatabase();
        this.initializeEventListeners();
    }

    initializeDatabase() {
        if (!localStorage.getItem('users')) {
            const defaultUsers = [
                {
                    id: 1,
                    name: 'Admin ShoeHelmet',
                    email: 'zeinsiadmin@gmail.com',
                    password: 'admin123',
                    role: 'admin',
                    registeredAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Demo User',
                    email: 'demo@shoehelmet.id',
                    password: 'demo123',
                    role: 'user',
                    registeredAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('users', JSON.stringify(defaultUsers));
        }
    }

    initializeEventListeners() {
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    showRegisterForm() {
        document.getElementById('loginBox').classList.remove('active');
        document.getElementById('registerBox').classList.add('active');
        this.clearErrors();
    }

    showLoginForm() {
        document.getElementById('registerBox').classList.remove('active');
        document.getElementById('loginBox').classList.add('active');
        this.clearErrors();
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
    }

    handleLogin() {
        this.clearErrors();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!this.validateEmail(email)) {
            document.getElementById('loginEmailError').textContent = 'Email tidak valid';
            return;
        }

        if (password.length < 6) {
            document.getElementById('loginPasswordError').textContent = 'Password minimal 6 karakter';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            const userSession = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'user'
            };
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            alert('Login berhasil! Selamat datang ' + user.name);
            
            if (user.role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            document.getElementById('loginEmailError').textContent = 'Email atau password salah';
        }
    }

    handleRegister() {
        this.clearErrors();
        
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        let hasError = false;

        if (name.length < 3) {
            document.getElementById('registerNameError').textContent = 'Nama minimal 3 karakter';
            hasError = true;
        }

        if (!this.validateEmail(email)) {
            document.getElementById('registerEmailError').textContent = 'Email tidak valid';
            hasError = true;
        }

        if (password.length < 6) {
            document.getElementById('registerPasswordError').textContent = 'Password minimal 6 karakter';
            hasError = true;
        }

        if (password !== confirmPassword) {
            document.getElementById('registerConfirmPasswordError').textContent = 'Password tidak sama';
            hasError = true;
        }

        if (hasError) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.some(u => u.email === email);

        if (emailExists) {
            document.getElementById('registerEmailError').textContent = 'Email sudah terdaftar';
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: 'user',
            registeredAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: 'user'
        };
        localStorage.setItem('currentUser', JSON.stringify(userSession));

        alert('Registrasi berhasil! Selamat datang ' + name);
        window.location.href = 'index.html';
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});
