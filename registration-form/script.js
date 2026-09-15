const form = document.getElementById("registrationForm");
const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const requirements = {
    length: document.getElementById("length"),
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    number: document.getElementById("number"),
    special: document.getElementById("special")
};

passwordInput.addEventListener("input", updatePasswordStrength);

function getPasswordRules(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
}

function updatePasswordStrength() {
    const password = passwordInput.value;
    const rules = getPasswordRules(password);
    const score = Object.values(rules).filter(Boolean).length;

    Object.entries(rules).forEach(([rule, isValid]) => {
        requirements[rule].classList.toggle("valid", isValid);
    });

    strengthBar.className = "";
    strengthText.className = "strength-text";

    if (!password) {
        strengthBar.style.width = "0";
        strengthText.textContent = "";
    } else if (score <= 2) {
        setStrength("33%", "Weak password", "weak");
    } else if (score <= 4) {
        setStrength("66%", "Medium password", "medium");
    } else {
        setStrength("100%", "Strong password", "strong");
    }
}

function setStrength(width, text, className) {
    strengthBar.style.width = width;
    strengthBar.classList.add(className);
    strengthText.textContent = text;
    strengthText.classList.add(className);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = passwordInput.value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const termsAccepted = document.getElementById("terms").checked;
    const rules = getPasswordRules(password);

    let isValid = true;

    if (fullName.length < 3) {
        showError("nameError", "Name must contain at least 3 characters.");
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError("emailError", "Enter a valid email address.");
        isValid = false;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        showError("phoneError", "Enter a valid 10-digit phone number.");
        isValid = false;
    }

    if (!Object.values(rules).every(Boolean)) {
        showError("passwordError", "Password does not meet all requirements.");
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError("confirmPasswordError", "Passwords do not match.");
        isValid = false;
    }

    if (!termsAccepted) {
        showError("termsError", "You must accept the terms and conditions.");
        isValid = false;
    }

    if (isValid) {
        document.getElementById("successMessage").textContent =
            "Registration completed successfully!";
        form.reset();
        updatePasswordStrength();
    }
});

function showError(id, message) {
    document.getElementById(id).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach((element) => {
        element.textContent = "";
    });
    document.getElementById("successMessage").textContent = "";
}
