// Accounts storage (simulating a database using localStorage)
const ACCOUNT_STORAGE_KEY = 'accounts'; // Key to store accounts in localStorage
const USER_STORAGE_KEY = 'user'; // Key to store logged-in user info

// Initialize storage if not set
if (!localStorage.getItem(ACCOUNT_STORAGE_KEY)) {
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify([])); // Empty accounts list
}

// Show specific form
function showForm(formId) {
    const allForms = document.querySelectorAll('.form-wrapper');
    allForms.forEach((form) => form.classList.remove('active')); // Hide all forms
    const targetForm = document.getElementById(formId);
    if (targetForm) {
        targetForm.classList.add('active'); // Show selected form
    } else {
        console.error(`Form with ID "${formId}" not found.`);
    }
}

// Login Validation
function validateForm(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || '[]');
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        // Store the logged-in user in localStorage
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(account));

        // Redirect to dashboard page
        window.location.href = "dashboard.html"; 
    } else {
        document.getElementById('error-message').innerText = 'Invalid username or password.';
    }
}

// Create Account
function createAccount(event) {
    event.preventDefault();
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        document.getElementById('create-error-message').innerText = 'Passwords do not match.';
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || '[]');
    if (accounts.some(acc => acc.username === username)) {
        document.getElementById('create-error-message').innerText = 'Username already exists.';
        return;
    }

    // Add the new account to localStorage
    accounts.push({ username, password });
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));

    alert('Account created successfully!');
    showForm('login-form'); // Show the login form
}

// Reset Password
function resetPassword(event) {
    event.preventDefault();
    const username = document.getElementById('reset-email').value;
    const newPassword = document.getElementById('new-password-reset').value;
    const confirmPassword = document.getElementById('confirm-password-reset').value;

    if (newPassword !== confirmPassword) {
        document.getElementById('reset-error-message').innerText = 'Passwords do not match.';
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || '[]');
    const accountIndex = accounts.findIndex(acc => acc.username === username);

    if (accountIndex === -1) {
        document.getElementById('reset-error-message').innerText = 'Username not found.';
        return;
    }

    // Update the password
    accounts[accountIndex].password = newPassword;
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));

    alert('Password reset successful! You can now log in with your new password.');
    showForm('login-form'); // Redirect to login form
}

// Check if the user is logged in
function checkUserLoggedIn() {
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    if (user) {
        // If the user is logged in, redirect to the dashboard or do something else
        window.location.href = 'dashboard.html';
    }
}

// Logout Function
function logout() {
    // Clear user data from localStorage
    localStorage.removeItem(USER_STORAGE_KEY); // Remove logged-in user data
    // localStorage.removeItem(ACCOUNT_STORAGE_KEY); // Uncomment if you want to clear accounts too

    // Redirect to login page
    window.location.href = 'index.html';
}

// Attach the logout function to the logout button
document.querySelector('.logout-btn').addEventListener('click', logout);

// Function to show the active tab
function showTab(tabId) {
    const allTabs = document.querySelectorAll('.tab-content');
    allTabs.forEach(tab => tab.classList.remove('active'));

    const allLinks = document.querySelectorAll('.tab-link');
    allLinks.forEach(link => link.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    const activeLink = document.getElementById(tabId + '-tab');
    activeLink.classList.add('active');
}

// QR Code generation for Virtual ID
// QR Code generation for Virtual ID
function generateQRCode() {
  const user = JSON.parse(localStorage.getItem('user'));
  const qrData = `ID: ${user.username}, Email: ${user.email}`; // Customize this based on your data

  QRCode.toCanvas(document.getElementById('qr-code'), qrData, function (error) {
      if (error) console.error(error);
  });
}

// Toggle Edit Profile
function toggleEditProfile() {
  document.getElementById('profile-username').readOnly = false;
  document.getElementById('profile-email').readOnly = false;
  document.getElementById('profile-bio').readOnly = false;
  document.getElementById('profile-skills').readOnly = false;
  document.querySelector('.edit-btn').classList.add('hidden');
  document.querySelector('.save-btn').classList.remove('hidden');
}

// Save Profile Changes
function saveProfile() {
  const newUsername = document.getElementById('profile-username').value;
  const newEmail = document.getElementById('profile-email').value;
  const newBio = document.getElementById('profile-bio').value;
  const newSkills = document.getElementById('profile-skills').value;

  // Save to localStorage (for now)
  const user = JSON.parse(localStorage.getItem('user'));
  user.username = newUsername;
  user.email = newEmail;
  user.bio = newBio;
  user.skills = newSkills;
  localStorage.setItem('user', JSON.stringify(user));

  alert('Profile updated successfully!');
  document.getElementById('profile-username').readOnly = true;
  document.getElementById('profile-email').readOnly = true;
  document.getElementById('profile-bio').readOnly = true;
  document.getElementById('profile-skills').readOnly = true;
  document.querySelector('.edit-btn').classList.remove('hidden');
  document.querySelector('.save-btn').classList.add('hidden');
}

// Change Password
function changePassword() {
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
  }

  alert('Password updated successfully!');
}

// Save Settings
function saveSettings() {
  const emailNotifications = document.getElementById('email-notifications').checked;
  alert('Settings saved successfully!');
}

// Call the QR Code generation on page load for profile
document.addEventListener('DOMContentLoaded', function () {
  generateQRCode();
});

