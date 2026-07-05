// ============================================================
// ZEEGO — Auth (simple demo/local, phone+OTP UI)
// ============================================================

const LS_USER = 'zeego_user';

export function getUser() {
    return JSON.parse(localStorage.getItem(LS_USER) || 'null');
}
export function saveUser(u) {
    localStorage.setItem(LS_USER, JSON.stringify(u));
    window.dispatchEvent(new Event('zeego:user-updated'));
}
export function logout() {
    localStorage.removeItem(LS_USER);
    window.dispatchEvent(new Event('zeego:user-updated'));
}

let pendingPhone = null;
let generatedOtp = null;

export function initAuth() {
    const loginModal = document.getElementById('loginModal');
    const closeLogin = document.getElementById('closeLogin');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const completeProfileBtn = document.getElementById('completeProfileBtn');
    const continueAsGuestBtn = document.getElementById('continueAsGuestBtn');
    const changeNumber = document.getElementById('changeNumber');
    const resendOtp = document.getElementById('resendOtp');
    const otpInputs = document.querySelectorAll('.otp-input');

    // Show
    document.getElementById('profileLoginBtn')?.addEventListener('click', () => {
        loginModal.classList.add('active');
    });
    closeLogin?.addEventListener('click', () => loginModal.classList.remove('active'));
    loginModal.querySelector('.modal-overlay').addEventListener('click', () => loginModal.classList.remove('active'));

    // Send OTP (demo — accept any 6-digit)
    sendOtpBtn?.addEventListener('click', () => {
        const cc = document.getElementById('countryCode').value;
        const p = document.getElementById('phoneNumber').value.trim();
        if (p.length < 8) { showToast('Enter a valid phone number'); return; }
        pendingPhone = cc + ' ' + p;
        generatedOtp = '123456'; // demo
        document.getElementById('phoneStep').style.display = 'none';
        document.getElementById('otpStep').style.display = 'block';
        document.getElementById('phoneDisplay').textContent = pendingPhone;
        showToast('Demo OTP: 123456');
        otpInputs[0]?.focus();
    });

    // OTP typing UX
    otpInputs.forEach((inp, idx) => {
        inp.addEventListener('input', () => {
            inp.value = inp.value.replace(/\D/g, '').slice(-1);
            if (inp.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
        });
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !inp.value && idx > 0) otpInputs[idx - 1].focus();
        });
    });

    verifyOtpBtn?.addEventListener('click', () => {
        const otp = Array.from(otpInputs).map(i => i.value).join('');
        if (otp !== generatedOtp) { showToast('Invalid OTP'); return; }
        // Check if user exists (by phone)
        const existing = getUser();
        if (existing && existing.phone === pendingPhone) {
            loginModal.classList.remove('active');
            showToast('Welcome back, ' + existing.name);
            return;
        }
        // Ask profile
        document.getElementById('otpStep').style.display = 'none';
        document.getElementById('profileStep').style.display = 'block';
    });

    completeProfileBtn?.addEventListener('click', () => {
        const name = document.getElementById('userName').value.trim() || 'Zeego User';
        const email = document.getElementById('userEmail').value.trim();
        saveUser({ name, email, phone: pendingPhone });
        loginModal.classList.remove('active');
        showToast('Welcome, ' + name + '!');
    });

    continueAsGuestBtn?.addEventListener('click', () => {
        saveUser({ name: 'Guest', email: '', phone: 'Guest' });
        loginModal.classList.remove('active');
    });

    changeNumber?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('otpStep').style.display = 'none';
        document.getElementById('phoneStep').style.display = 'block';
    });
    resendOtp?.addEventListener('click', (e) => { e.preventDefault(); showToast('Demo OTP: 123456'); });

    // Logout row
    document.getElementById('profileLogoutRow')?.addEventListener('click', () => {
        if (confirm('Log out of Zeego?')) { logout(); showToast('Logged out'); }
    });
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove('show'), 2600);
}
