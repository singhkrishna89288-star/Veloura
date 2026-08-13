/* =====================================================
   VELOURA — auth.js
   Handles registration, login, logout, and current-user state.
===================================================== */

const API_BASE = '/api';

const Auth = {
  getToken() {
    return localStorage.getItem('veloura_token');
  },
  getUser() {
    const raw = localStorage.getItem('veloura_user');
    return raw ? JSON.parse(raw) : null;
  },
  isLoggedIn() {
    return Boolean(this.getToken());
  },
  isAdmin() {
    const user = this.getUser();
    return Boolean(user && user.role === 'admin');
  },
  setSession(token, user) {
    localStorage.setItem('veloura_token', token);
    localStorage.setItem('veloura_user', JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem('veloura_token');
    localStorage.removeItem('veloura_user');
  },
  authHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...Auth.authHeaders(),
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = { success: false, message: 'Unexpected server response.' };
  }

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong.');
  }
  return data;
}

async function registerUser(fullName, email, password, confirmPassword) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password, confirmPassword }),
  });
  Auth.setSession(data.token, data.user);
  return data;
}

async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  Auth.setSession(data.token, data.user);
  return data;
}

function logoutUser() {
  Auth.clearSession();
  showToast('Logged out successfully.');
  navigateTo('home');
  updateAuthUI();
}

async function fetchProfile() {
  return apiRequest('/auth/profile');
}

function updateAuthUI() {
  const adminBtn = document.getElementById('adminTabBtn');
  if (adminBtn) {
    adminBtn.style.display = Auth.isAdmin() ? 'block' : 'none';
  }
}

/* -------- Login form -------- */
document.addEventListener('submit', async (e) => {
  if (e.target.id === 'loginForm') {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    try {
      await loginUser(email, password);
      showToast('Welcome back!');
      updateAuthUI();
      navigateTo('account');
    } catch (err) {
      showToast(err.message, true);
    }
  }

  if (e.target.id === 'registerForm') {
    e.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', true);
      return;
    }

    try {
      await registerUser(fullName, email, password, confirmPassword);
      showToast('Account created! Welcome to Veloura.');
      updateAuthUI();
      navigateTo('account');
    } catch (err) {
      showToast(err.message, true);
    }
  }
});
