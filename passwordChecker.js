document.getElementById("new-password").addEventListener("input", checkPasswordStrength);

function checkPasswordStrength() {
    const password = document.getElementById("new-password").value;
    const strengthMessage = document.getElementById("strengthMessage");
    let strength = "";

    if (password.length < 6) {
        strength = "weak";
    } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
        strength = "strong";
    } else {
        strength = "medium";
    }

    strengthMessage.textContent = `Password strength: ${strength}`;
    strengthMessage.className = `strength ${strength}`;
}
