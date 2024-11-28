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
document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    if (user) {
        loadProfile(user.username);
        generateQRCode();
    }
});

// Load profile data for the logged-in user
function loadProfile(username) {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || [];
    const user = accounts.find((acc) => acc.username === username);

    if (user) {
        // Populate profile fields
        document.getElementById('profile-username').value = user.username || '';
        document.getElementById('profile-email').value = user.email || '';
        document.getElementById('profile-bio').value = user.bio || '';
        document.getElementById('profile-skills').value = user.skills || '';

        // Load profile picture
        const profilePic = document.querySelector('.profile-pic-section img');
        profilePic.src = user.profilePic || 'profile-placeholder.jpg';
    }
}

// Save profile changes to localStorage
function saveProfile() {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || [];
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (user) {
        const accountIndex = accounts.findIndex((acc) => acc.username === user.username);
        if (accountIndex !== -1) {
            // Update profile details
            accounts[accountIndex].email = document.getElementById('profile-email').value;
            accounts[accountIndex].bio = document.getElementById('profile-bio').value;
            accounts[accountIndex].skills = document.getElementById('profile-skills').value;

            // Save updated accounts back to localStorage
            localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
            alert('Profile updated successfully!');
        }
    }

    toggleEditProfile(); // Exit edit mode
}

// Toggle edit mode for profile
function toggleEditProfile() {
    const inputs = document.querySelectorAll('#profile input, #profile textarea');
    const editButton = document.querySelector('.edit-btn');
    const saveButton = document.querySelector('.save-btn');

    if (editButton.textContent === 'Edit Profile') {
        // Enable editing
        inputs.forEach((input) => (input.readOnly = false));
        editButton.textContent = 'Cancel Edit';
        saveButton.classList.remove('hidden');
    } else {
        // Disable editing
        inputs.forEach((input) => (input.readOnly = true));
        editButton.textContent = 'Edit Profile';
        saveButton.classList.add('hidden');
    }
}

// Upload and save profile picture
function uploadProfilePicture(event) {
    const file = event.target.files[0];
    const profilePic = document.querySelector('.profile-pic-section img');
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (file && user) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic.src = e.target.result;

            // Save the uploaded image in localStorage
            const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || [];
            const accountIndex = accounts.findIndex((acc) => acc.username === user.username);

            if (accountIndex !== -1) {
                accounts[accountIndex].profilePic = e.target.result;
                localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
            }
        };
        reader.readAsDataURL(file);
    }
}

// Change and save new password
function changePassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (!newPassword || !confirmPassword) {
        alert('Please fill in both password fields.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || [];
    const accountIndex = accounts.findIndex((acc) => acc.username === user.username);

    if (accountIndex !== -1) {
        accounts[accountIndex].password = newPassword;
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
        alert('Password changed successfully!');
    }
}

// Generate QR code for the virtual ID
// Generate a unique Virtual ID
// Generate a unique Virtual ID
// Generate a unique Virtual ID (only when needed)
// Generate a unique Virtual ID (only when needed)
function generateVirtualID(username) {
    const randomHash = Math.random().toString(36).substr(2, 9); // Generate a random string
    return `${username}-${randomHash}`; // Combine username with the random string
}

// Ensure the Virtual ID is set for the user
function ensureVirtualID() {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || [];
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (user) {
        const accountIndex = accounts.findIndex(acc => acc.username === user.username);

        if (accountIndex !== -1) {
            const account = accounts[accountIndex];

            // Check if Virtual ID already exists
            if (!account.virtualID) {
                // Generate and save Virtual ID if it doesn't exist
                account.virtualID = generateVirtualID(account.username);
                accounts[accountIndex] = account;
                localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
            }

            // Update the logged-in user's data in localStorage
            user.virtualID = account.virtualID;
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        }
    }
}

// Generate QR Code for the Digital ID tab
function generateDigitalID() {
    ensureVirtualID(); // Ensure the user has a Virtual ID
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (user) {
        // Display the Virtual ID
        const virtualIDElement = document.getElementById('virtual-id');
        if (virtualIDElement) {
            virtualIDElement.textContent = user.virtualID;
        }

        // Generate QR Code Data
        const qrData = JSON.stringify({
            username: user.username,
            email: user.email,
            virtualID: user.virtualID,
        });

        // Check if the QR Code element exists
        const qrCodeElement = document.getElementById('qr-code');
        if (qrCodeElement) {
            // Clear any previous QR Code before rendering a new one
            qrCodeElement.innerHTML = '';

            // Generate the QR code
            new QRCode(qrCodeElement, {
                text: qrData,
                width: 200,
                height: 200,
            });
        }
    } else {
        alert('User data not found. Please log in again.');
    }
}

// Save profile changes and refresh QR code
function saveProfile() {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || [];
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (user) {
        const accountIndex = accounts.findIndex(acc => acc.username === user.username);

        if (accountIndex !== -1) {
            // Update profile details in the account
            accounts[accountIndex].email = document.getElementById('profile-email').value;
            accounts[accountIndex].bio = document.getElementById('profile-bio').value;
            accounts[accountIndex].skills = document.getElementById('profile-skills').value;

            // Save updated accounts back to localStorage
            localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));

            // Update logged-in user data in localStorage
            user.email = accounts[accountIndex].email;
            user.bio = accounts[accountIndex].bio;
            user.skills = accounts[accountIndex].skills;
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

            // Refresh QR code
            generateDigitalID();

            alert('Profile updated successfully!');
        }
    }

    toggleEditProfile(); // Exit edit mode
}

// Attach the Digital ID tab functionality
document.addEventListener('DOMContentLoaded', function () {
    const digitalIDTab = document.getElementById('digital-id');
    if (digitalIDTab) {
        generateDigitalID(); // Generate the QR Code and Virtual ID on load
    }
});

// Toggle the image selection based on PDF creation checkbox
// Handle file uploads (Upload Document Button)
function handleFileUpload(event) {
    const files = event.target.files;
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (files && user) {
        const documentID = `${user.username}-${Date.now()}`;

        const reader = new FileReader();
        reader.onload = function (e) {
            const documents = JSON.parse(localStorage.getItem('user_documents') || '[]');
            documents.push({
                id: documentID,
                name: files[0].name,
                data: e.target.result, // File data (could be an image or PDF)
                type: files[0].type,
                userId: user.username, // Store user ID
            });

            // Save documents back to localStorage
            localStorage.setItem('user_documents', JSON.stringify(documents));

            // Update the document list UI
            displayDocuments();
        };
        reader.readAsDataURL(files[0]); // Handle a single file upload
    } else {
        alert('No file selected or user not found.');
    }
}

// Handle document scan (Scan Document Button)
function handleScanUpload(event) {
    const file = event.target.files[0];
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));

    if (file && user) {
        const documentID = `${user.username}-${Date.now()}`;

        const reader = new FileReader();
        reader.onload = function (e) {
            const documents = JSON.parse(localStorage.getItem('user_documents') || '[]');
            documents.push({
                id: documentID,
                name: file.name,
                data: e.target.result,
                type: file.type,
                userId: user.username, // Store user ID
            });

            // Save documents back to localStorage
            localStorage.setItem('user_documents', JSON.stringify(documents));

            // Update the document list UI
            displayDocuments();
        };
        reader.readAsDataURL(file); // Read file as base64 URL
    } else {
        alert('No file selected or user not found.');
    }
}

// Display documents (both uploaded and scanned)
function displayDocuments() {
    const documentsList = document.getElementById('documents-list');
    documentsList.innerHTML = ''; // Clear the list before adding new documents

    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    const documents = JSON.parse(localStorage.getItem('user_documents') || '[]');

    // Filter documents for the current user
    const userDocuments = documents.filter(doc => doc.userId === user.username);

    userDocuments.forEach(doc => {
        const listItem = document.createElement('li');
        listItem.classList.add('document-item');

        const documentPreview = document.createElement('div');
        documentPreview.classList.add('document-preview');

        // Display document preview (image or PDF)
        if (doc.type.startsWith('image')) {
            const img = document.createElement('img');
            img.src = doc.data;
            img.alt = doc.name;
            img.style.maxWidth = '100px';
            img.style.maxHeight = '100px';
            documentPreview.appendChild(img);
        } else if (doc.type.startsWith('pdf')) {
            const pdfPreview = document.createElement('p');
            pdfPreview.textContent = 'PDF Document: ' + doc.name;
            documentPreview.appendChild(pdfPreview);
        }

        const documentDetails = document.createElement('div');
        documentDetails.classList.add('document-details');
        const documentName = document.createElement('p');
        documentName.textContent = doc.name;
        documentDetails.appendChild(documentName);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () {
            deleteDocument(doc.id);
        };

        documentDetails.appendChild(deleteButton);

        listItem.appendChild(documentPreview);
        listItem.appendChild(documentDetails);
        documentsList.appendChild(listItem);
    });
}

// Delete document (based on document ID)
function deleteDocument(documentID) {
    const documents = JSON.parse(localStorage.getItem('user_documents') || '[]');
    const filteredDocuments = documents.filter(doc => doc.id !== documentID);

    // Save back to localStorage
    localStorage.setItem('user_documents', JSON.stringify(filteredDocuments));

    // Update the document list UI
    displayDocuments();
}

// Initial call to display documents when the page loads
document.addEventListener('DOMContentLoaded', function () {
    displayDocuments(); // Display the user's documents when the dashboard loads
});

// Launch the camera and capture an image using MediaDevices API
// Launch the camera and capture an image using MediaDevices API
let cameraStream = null; // To keep track of the camera stream

// Open the camera
function openCamera() {
    const video = document.getElementById('camera-video');
    const cameraPreview = document.getElementById('camera-preview');

    // Display the camera preview container
    cameraPreview.style.display = 'flex';
    cameraPreview.style.flexDirection = 'column';
    cameraPreview.style.alignItems = 'center';
    cameraPreview.style.marginTop = '20px';

    // Request access to the camera
    navigator.mediaDevices
        .getUserMedia({ video: true }) // Request camera access
        .then((stream) => {
            cameraStream = stream; // Store the stream globally
            video.srcObject = stream;
            video.play();
        })
        .catch((error) => {
            console.error('Camera access denied or not available:', error);
            alert('Unable to access the camera.');
            cameraPreview.style.display = 'none'; // Hide the preview container if access fails
        });
}

// Capture the image
function captureImage() {
    const video = document.getElementById('camera-video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Draw the video frame to the canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the captured image as Base64
    const imageData = canvas.toDataURL('image/png');

    // Save the captured image
    saveCapturedImage(imageData);

    // Close the camera
    closeCamera();
}

// Save the captured image and display it in the document list
function saveCapturedImage(imageData) {
    const user = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    if (user) {
        const documentID = `${user.username}-${Date.now()}`;
        const documents = JSON.parse(localStorage.getItem('user_documents') || '[]');

        documents.push({
            id: documentID,
            name: `Captured-${Date.now()}.png`,
            data: imageData,
            type: 'image/png',
            userId: user.username,
        });

        localStorage.setItem('user_documents', JSON.stringify(documents));
        displayDocuments(); // Refresh the document list
    }
}

// Close the camera
function closeCamera() {
    const cameraPreview = document.getElementById('camera-preview');

    if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
        cameraStream = null; // Reset the stream reference
    }

    cameraPreview.style.display = 'none'; // Hide the camera preview
}

// Stop the camera on tab switch
function stopCameraOnTabSwitch() {
    const tabs = document.querySelectorAll('.tab-link');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            closeCamera(); // Close the camera when switching tabs
        });
    });
}

// Call stopCameraOnTabSwitch on page load
document.addEventListener('DOMContentLoaded', stopCameraOnTabSwitch);

// Toggle the menu visibility when the logo is clicked
// Toggle the menu visibility when the logo is clicked
// Function to show the Home content when the logo is clicked
function showHome() {
    const allTabs = document.querySelectorAll('.tab-content'); // Hide all tabs
    allTabs.forEach((tab) => tab.classList.remove('active'));

    const allLinks = document.querySelectorAll('.tab-link'); // Deactivate all tab links
    allLinks.forEach((link) => link.classList.remove('active'));

    // Activate the home content
    const homeContent = document.getElementById('home');
    if (homeContent) {
        homeContent.classList.add('active'); // Show home content
    }
}

// Attach the showHome function to the logo programmatically
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.sidebar-header .logo');
    if (logo) {
        logo.addEventListener('click', showHome);
    } else {
        console.error("Logo element not found.");
    }

    // Ensure Home content is displayed by default
    showHome();
});




